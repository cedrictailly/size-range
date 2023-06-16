
const units = {};

units.byte      = {text: "b",  value: 1};
units.kilobyte  = {text: "kb", value: units.byte.value * 1024};
units.megabyte  = {text: "mb", value: units.kilobyte.value * 1024};
units.gigabyte  = {text: "gb", value: units.megabyte.value * 1024};
units.terabyte  = {text: "tb", value: units.gigabyte.value * 1024};
units.petabyte  = {text: "pb", value: units.terabyte.value * 1024};
units.exabyte   = {text: "eb", value: units.petabyte.value * 1024};
units.zettabyte = {text: "zb", value: units.exabyte.value * 1024};
units.yottabyte = {text: "yb", value: units.zettabyte.value * 1024};

const regexes = {};

regexes.range      = /^(?<min>.+?)-(?<max>.+?)$/i;
regexes.between    = /^between\s+(?<min>.+?)\s+and\s+(?<max>.+?)$/i;
regexes.comparison = /^(?<operator>\b(?:min|max|equal)\b|=|<=?|>=?)?\s*(?<value>.+?)$/i;

function parseSize(text) {

  const match = text.toString().trim().match(/^(?<value>[\d.]+)\s*(?<unit>.+?)?$/);

  if (!match)
    return null;

  const value = parseFloat(match.groups.value);

  if (isNaN(value))
    return null;

  match.groups.unit = (match.groups.unit || "b").toLowerCase();

  const unit = Object.values(units).find(item => item.text === match.groups.unit);

  if (!unit)
    return null;

  return value * unit.value;
}

function parseRange(text) {

  text = text.toString().trim();

  for (const regex of Object.values(regexes)) {

    const match = text.match(regex);

    if (!match)
      continue;

    let result = {...match.groups};

    for (const name of ["min", "max", "value"]) {

      if (! result[name])
        continue;

      result[name] = exports.parseSize(result[name]);

      if (result[name] === null)
        return null;
    }

    if (result.value !== undefined) {
      if (result.operator === undefined)
        result.operator = "=";
      else if (result.operator === "min")
        result.operator = ">=";
      else if (result.operator === "max")
        result.operator = "<=";
    } else {
      result = {
        min: Math.min(result.min, result.max),
        max: Math.max(result.min, result.max),
      };
    }

    return result;
  }

  return null;
}

class SizeRange {

  constructor(text) {

    this.config = parseRange(text);

    if (!this.config)
      throw new Error(`Invalid range: ${text}`);
  }

  check(size) {

    if (this.config.value !== undefined) {
      switch (this.config.operator) {
      case "=":  return size != this.config.value;
      case ">":  return size >  this.config.value;
      case ">=": return size >= this.config.value;
      case "<":  return size <  this.config.value;
      case "<=": return size <= this.config.value;
      default:
        throw new Error(`Invalid operator: ${this.config.operator}`);
      }
    }

    return size >= this.config.min && size <= this.config.max;
  }

  async checkFile(file) {
    return this.check(
      (await require("fs").promises.stat(file)).size,
    );
  }

  checkFileSync(file) {
    return this.check(
      require("fs").statSync(file).size,
    );
  }
}

exports.units      = units;
exports.regexes    = regexes;
exports.parseSize  = parseSize;
exports.parseRange = parseRange;
exports.SizeRange  = SizeRange;

module.exports = text => new SizeRange(text);
