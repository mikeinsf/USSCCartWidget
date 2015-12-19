if (typeof(__CartParams) == 'undefined') {

    alert('Cannot load cart widget. Missing __CartParams object.\nSettings object must be embedded in your template. \nPlease contact Langtech support if you have questions.');

} else {

    if (typeof(__CartParams.path) == 'undefined') {

        alert('Cannot load cart widget. Missing __CartParams.path setting. \nPlease contact Langtech support if you have questions.');

    } else {

        if (__CartParams.path.length < 2) {

            alert('Cannot load cart widget. __CartParams.path is not set properly. \nPlease contact Langtech support if you have questions.');

        } else {

            var requireScriptPath = __CartParams.path[0] + __CartParams.path[1];
            require.config({
                urlArgs: "[RANDOM]",  // gulp will replace [RANDOM] with a random number
                paths: {
                    jquery: requireScriptPath + '/jquery',
                    cookie: requireScriptPath + '/js.cookie',
                    React: requireScriptPath + '/react',
                    classnames: requireScriptPath + '/classnames',
                    reactComponents: requireScriptPath + '/reactComponents',
                    cartWidget: requireScriptPath + '/cartWidget',
                    moment: requireScriptPath + '/moment',
                },
                shim: {
                    'cartWidget': {
                        deps: ['reactComponents', 'moment'],
                    },
                    'reactComponents': {
                        deps: ['jquery', 'cookie', 'React', 'classnames'],
                    },
                },
            })
            require( ['jquery', 'cookie', 'React', 'classnames', 'reactComponents', 'moment', 'cartWidget'],
                function ($, cookie, React, classnames, reactComponents, moment, cartWidget) {
                    window.cookie = cookie;
                    window.moment = moment;
                    __CartWidget.initCart();
                }
            );

        }

    }

}
