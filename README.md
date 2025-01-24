# Enum Creator
The `enumCreator` is a module that offers various methods to write the code that defines an enum in a newly created typescript file. If the enum that you wish to define requires many constants and you have the names and values of these constants in a json or csv file or object or array form than `enumCreator` can read that information and write the code for you.

## Methods
- `createFromJSON` - used to convert the data in a json file to code that defines an enum
- `createFromCSV` - used to convert the data in a csv file to code that defines an enum
- `createFromObject` - used to convert the data in a object to code that defines an enum
- `createFromArray` - used to convert the data in a array to code that defines an enum

## Examples  
```Javascript
const colors = ["red", "blue", "green", "purple", ...];
enumCreator.createFromArray(colors, "Color");
```
```Javascript
const stockIds = {
    cheese: 34781,
    ham: 57819,
    bread: 18027,
    ...
}
enumCreator.createFromObject(stockIds, "StockId");
```
```Javascript 
enumCreator.createFromJSON("./country-codes.json", "CountryCode");
```
```Javascript 
enumCreator.createFromCSV("./postcodes.csv", "postcodes");
```

### Exports
- `enumCreator` as default

### Dependencies
- @mitchell-collins/validator
    - https://github.com/MitchellCollins/validator
    - https://www.npmjs.com/package/@mitchell-collins/validator