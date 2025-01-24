import validator from "@mitchell-collins/validator";
import fs from "fs";

/**
 * The `enumCreator` is a module that offers various methods to write the code that defines an enum in a newly created typescript
 * file. If the enum that you wish to define requires many constants and you have the names and values of these constants in
 * a json or csv file or object or array form than `enumCreator` can read that information and write the code for you.
 * 
 * `enumCreator` offers the methods:
 * - `createFromJSON` - used to convert the data in a json file to code that defines an enum
 * - `createFromCSV` - used to convert the data in a csv file to code that defines an enum
 * - `createFromObject` - used to convert the data in a object to code that defines an enum
 * - `createFromArray` - used to convert the data in a array to code that defines an enum
 * 
 * @example
 *  
 *      const colors = ["red", "blue", "green", "purple", ...];
 *      enumCreator.createFromArray(colors, "Color");
 * 
 *      const stockIds = {
 *          cheese: 34781,
 *          ham: 57819,
 *          bread: 18027,
 *          ...
 *      }
 *      enumCreator.createFromObject(stockIds, "StockId");
 * 
 *      enumCreator.createFromJSON("./country-codes.json", "CountryCode");
 * 
 *      enumCreator.createFromCSV("./postcodes.csv", "postcodes");
 * 
 * @module
 */
const enumCreator = {

    /**
     * Used to convert the data in a json file to code that defines an enum.
     * 
     * The key is asigned as the constant name which is upper cased, ensure that key isn't a number.
     * 
     * The value is assigned as the value to the constant, ensure that value is of number or string.
     * 
     * @param {String} filePath the file path to the json file
     * @param {String} enumName the name that is given to the enum and new typescript file.
     */
    createFromJSON(filePath, enumName) {
        validator.checkUndefinedArray([filePath, enumName], ["filePath", "enumName"]);
        validator.checkDataTypeArray([filePath, enumName], ["filePath", "enumName"], "string");

        // checks if file isn't a json file throws error 
        if (!filePath.includes(".json")) throw new Error("Must be a JSON file");

        // reads the requested file
        const data = fs.readFileSync(filePath, { encoding: "utf-8" });

        // converts data from string to object
        const object = JSON.parse(data);

        this.createFromObject(object, enumName);
    },

    /**
     * Used to convert the data in a csv file to code that defines an enum.
     * 
     * The first lien of the csv file are treated as the headings and for each heading an enum is made in a typescript file,
     * and all the values in the matching column are assigned as its constants. The name will the value in upper case and the
     * value is assigned without changes. Ensure that the value is not a number.
     *  
     * @param {String} filePath the file path to the csv file
     * @param {String} newFileName the name of the newly created typescript file
     */
    createFromCSV(filePath, newFileName) {
        validator.checkUndefinedArray([filePath, newFileName], ["filePath", "newFileName"]);
        validator.checkDataTypeArray([filePath, newFileName], ["filePath", "newFileName"], "string");

        // checks if file isn't a csv file throws error 
        if (!filePath.includes(".csv")) throw new Error("Must be a CSV file");

        // reads the csv file
        const data = fs.readFileSync(filePath, { encoding: "utf-8" });

        // deconstructs data
        const lines = data.split("\n");
        const headings = lines[0].split(",");
        let newFileData = "";

        // loops through each heading/enum object
        headings.forEach((heading, index) => {
            // defines the initial code that defines the next enum
            newFileData += `const enum ${heading} {\n`;

            // loops through each line 
            for (let i = 1; i < lines.length; i++) {
                // deconstructs and gets the value that is in the column of the current heading
                const values = lines[i].split(",");
                let value = values[index];

                // checks if there is an unecessary space at the start of the string and removes it
                // this can happen during the splitting process as some elements can be seperate by ", " not just ","
                value = value[0] === " " ? value.slice(1, value.length) : value;
                
                // defines constant in enum
                newFileData += `${value.toUpperCase()} = "${value}",\n`;
            }

            // closes defined enum
            newFileData += "}\n";
        });

        // as code that exports the defined enums
        newFileData += "export {\n";

        headings.forEach((heading) => {
            newFileData += `${heading},\n`
        });

        newFileData += "}";
    
        // writes the typescript file
        fs.writeFileSync(`${newFileName}.ts`, newFileData);
    },

    /**
     * Used to convert the data in a object to code that defines an enum.
     * 
     * The key is asigned as the constant name which is upper cased, ensure that key isn't a number.
     * 
     * The value is assigned as the value to the constant, ensure that value is of number or string.
     * 
     * @param {object} object the object that will be converted into a enum
     * @param {String} enumName the name of the defined enum and newly created typescript file
     */
    createFromObject(object, enumName) {
        validator.checkUndefinedArray([object, enumName], ["object", "enumName"]);
        validator.checkDataType(object, "object", "object");
        validator.checkDataType(enumName, "enumName", "string");
        
        // defines the starting line of the new file to be created
        let newFileData = `const enum ${enumName} { \n`;

        // loops through entries of the object
        Object.entries(object).forEach(([key, value]) => {
            newFileData += `${key.toUpperCase()} = "${value}", \n`;
        });

        // adds final bit of code
        newFileData += `}\nexport default ${enumName};`;

        // creates new file with enum code
        fs.writeFileSync(`${enumName}.ts`, newFileData);
    },

    /**
     * Used to convert the data in a array to code that defines an enum.
     * 
     * Each element in the array is assigned as a constant of the created enum. The name is upper case and the value is 
     * unchanged. Ensure that the elements have the value of a string.
     * 
     * @param {String[]} array the array that is converted into a enum in a newly created typescript file
     * @param {String} enumName the name of the defined enum
     */
    createFromArray(array, enumName) {
        validator.checkUndefinedArray([array, enumName], ["array", "enumName"]);
        validator.checkIsArray(array, "array");
        validator.checkDataType(enumName, "enumName", "string");

        // defines the starting line of the new file to be created
        let newFileData = `const enum ${enumName} { \n`;

        // loops through array
        array.forEach((element) => {
            newFileData += `${element.toUpperCase()} = "${element}",\n`;
        });

        // adds final bit of code
        newFileData += `}\nexport default ${enumName};`;

        // creates new file with enum code
        fs.writeFileSync(`${enumName}.ts`, newFileData);
    }
}

export default enumCreator;