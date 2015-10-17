var requireScriptPath = __CartParams.path[0] + __CartParams.path[1];

require.config({
    paths: {
        jquery: requireScriptPath + '/jquery',
        React: requireScriptPath + '/react',
        JSXTransformer: requireScriptPath + '/JSXTransformer',
        classnames: requireScriptPath + '/classnames',
        documentRegisterElement: requireScriptPath + '/document-register-element',
        reactComponents: requireScriptPath + '/reactComponents',
        cartWidget: requireScriptPath + '/cartWidget',
        reactiveElements: requireScriptPath + '/reactive-elements',
        cookie: requireScriptPath + '/js.cookie',
    },
})

require( ['jquery', 'React', 'JSXTransformer', 'classnames', 'documentRegisterElement'],

    function ($, React, JSXTransformer, classnames, documentRegisterElement ) {

        // window.React = React;

        require(['reactComponents', 'cartWidget', 'reactiveElements', 'cookie'],

            function(reactComponents, cartWidget, reactiveElements, cookie) {

                window.cookie = cookie;
                document.registerReact('cart-container', CartUI_Container);
                __CartWidget.initCart(__CartParams);

            }

        );

    }

);
