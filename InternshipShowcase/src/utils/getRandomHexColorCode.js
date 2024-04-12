const getRandomHexColorCode = () => {
    const date = new Date();
    const seed = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    
    // Seeded random number generator
    const seededRandom = (seed) => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    // Generate a random number between 0 and 16777215 (0xFFFFFF in decimal) using the seeded random number generator
    const randomColor = Math.floor(seededRandom(seed) * 16777215);

    // Convert the number to hexadecimal and pad with zeros if necessary
    const hexColor = '#' + randomColor.toString(16).padStart(6, '0');

    console.log("Todays color is: " + hexColor);
    return hexColor;
};

export {getRandomHexColorCode};