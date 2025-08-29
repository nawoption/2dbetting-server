module.exports = {
    generateSlipCode: () => {
        const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
        const ts = Date.now().toString();
        return `#${rand}${ts}`;
    },
};
