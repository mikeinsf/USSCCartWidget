require.config({
    paths: {
        jquery: __CartParams.baseUrl + 'jquery',
        React: __CartParams.baseUrl + 'react',
        JSXTransformer: __CartParams.baseUrl + 'JSXTransformer',
        classnames: __CartParams.baseUrl + 'classnames',
        documentRegisterElement: __CartParams.baseUrl + 'document-register-element',
        reactComponents: __CartParams.baseUrl + 'reactComponents',
        cartWidget: __CartParams.baseUrl + 'cartWidget',
        reactiveElements: __CartParams.baseUrl + 'reactive-elements',
    },
})


require( ['jquery', 'React', 'JSXTransformer', 'classnames', 'documentRegisterElement'],

    function ($, React, JSXTransformer, classnames, documentRegisterElement ) {

        // window.React = React;

        require(['reactComponents', 'cartWidget', 'reactiveElements'],

            function(reactComponents, cartWidget, reactiveElements) {

                document.registerReact('cart-container', CartUI_Container);
                __CartWidget.initCart(__CartParams);

            }

        );

    }

);
