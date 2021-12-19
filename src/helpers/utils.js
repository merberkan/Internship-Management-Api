
const uuid = (length) => {
    let dt = new Date().getTime();
    const _uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return length ? _uuid.replace(/-/g, '').substring(0, length) : _uuid.replace(/-/g, '');
};

module.exports = {
    uuid
};