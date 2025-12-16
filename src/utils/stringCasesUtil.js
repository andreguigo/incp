export const useStringCaseUtil = () => ({
    firstUpperCase(str) {
        if (!str) return '';

        const strArray = Array.isArray(str) ? str : str.split(',');
        return strArray
            .map(word => {
                return word
                    .trim()
                    .split(/\s+/)
                    .map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    )
                    .join(' ');
            })   
            .join(', ');
    },
});