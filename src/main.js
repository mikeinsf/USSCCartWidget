require.config({
    paths: {
        jquery: __CartParams.baseUrl + '/cart-widget/jquery',
        React: __CartParams.baseUrl + '/cart-widget/react',
        JSXTransformer: __CartParams.baseUrl + '/cart-widget/JSXTransformer',
        classnames: __CartParams.baseUrl + '/cart-widget/classnames',
        documentRegisterElement: __CartParams.baseUrl + '/cart-widget/document-register-element',
        reactComponents: __CartParams.baseUrl + '/cart-widget/reactComponents',
        cartWidget: __CartParams.baseUrl + '/cart-widget/cartWidget',
        reactiveElements: __CartParams.baseUrl + '/cart-widget/reactive-elements',
        cookie: __CartParams.baseUrl + '/cart-widget/js.cookie',
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
