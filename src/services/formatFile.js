function getFormattedFileName(fileName) {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0]; // Format: YYYY-MM-DD_HH-MM-SS
    return `${timestamp}_${fileName.replace(/\s+/g, '')}`;
}

export default getFormattedFileName;