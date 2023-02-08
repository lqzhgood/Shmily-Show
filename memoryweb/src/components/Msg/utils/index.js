function mixRules(o, fn) {
    Object.entries(o).forEach(([k, v]) => {
        o[k] = m => fn(m) && v(m);
    });
    return o;
}

module.exports = {
    mixRules,
};
