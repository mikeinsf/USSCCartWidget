require.config({
    paths: {
        documentRegisterElement: 'document-register-element',
        reactiveElements: 'reactive-elements',
    },
    shim: {
        'reactiveElements': ['React', 'documentRegisterElement'],
    },
})


require( ['jquery', 'React', 'JSXTransformer', 'classnames', 'documentRegisterElement'],

    function ($, React, JSXTransformer, cartWidget, classnames, documentRegisterElement ) {

        // window.React = React;

        require(['reactComponents', 'cartWidget', 'reactiveElements'],

            function(reactComponents, cartWidget, reactiveElements) {

                document.registerReact('cart-container', CartUI_Container);
                __CartWidget.initCart(__CartParams);

            }

        );

    }

);
