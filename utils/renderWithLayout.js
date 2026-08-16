function renderWithLayout(res, view, props = {}, next) {
    res.render(view, props, (err, html) => {
        if (err) {
            return next(err);
        }

        res.render("layouts/boilerplate", {
            body: html,
            ...props
        });
    });
}

module.exports = renderWithLayout;