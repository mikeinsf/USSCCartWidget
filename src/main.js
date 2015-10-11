require.config({
    paths: {
        jquery: 'http://localhost:8081/jquery',
        React: 'http://localhost:8081/react',
        JSXTransformer: 'http://localhost:8081/JSXTransformer',
        classnames: 'http://localhost:8081/classnames',
        documentRegisterElement: 'http://localhost:8081/document-register-element',
        reactComponents: 'http://localhost:8081/reactComponents',
        cartWidget: 'http://localhost:8081/cartWidget',
        reactiveElements: 'http://localhost:8081/reactive-elements',
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
