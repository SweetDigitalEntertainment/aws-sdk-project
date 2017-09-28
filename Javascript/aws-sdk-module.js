var Utility = {
    Utility_GetPointerFromStr: function (str) {
        var numBytes = lengthBytesUTF8(str) + 1;
        var buffer = _malloc(numBytes);
        stringToUTF8(str, buffer, numBytes);
        return buffer;
    },

    Utility_InvokeWebGLCallback__deps: ['Utility_GetPointerFromStr'],
    Utility_InvokeWebGLCallback: function (callback, callId, result, isError) {
        Runtime.dynCall('viii', callback, [
            callId, _Utility_GetPointerFromStr(result), isError
        ]);
    }
};

var NativeObject = {
    NativeObject_Instances : [],
    NativeObject_IdPool :[],

    NativeObject_Register__deps: ['NativeObject_Instances', 'NativeObject_IdPool'],
    NativeObject_Register: function (instance) {
        var nativeId;
        
        if (_NativeObject_IdPool.length == 0) {
            nativeId = _NativeObject_Instances.length;
            _NativeObject_Instances.push(instance);
        }
        else {
            var lastIndex = _NativeObject_IdPool.length - 1;
            nativeId = _NativeObject_IdPool[lastIndex];
            _NativeObject_IdPool.splice(lastIndex, 1);
            _NativeObject_Instances[nativeId] = instance;
        }

        return nativeId;
    },

    NativeObject_Get__deps: ['NativeObject_Instances'],
    NativeObject_Get: function (nativeId) {
        return _NativeObject_Instances[nativeId];
    },

    NativeObject_Release__deps: ['NativeObject_Instances', 'NativeObject_IdPool'],
    NativeObject_Release: function (nativeId) {
        _NativeObject_IdPool.push(nativeId);
        _NativeObject_Instances[nativeId] = null;
    },
};

var CognitoIdentityCredentials = {
    CognitoIdentityCredentials_Construct__deps: ['NativeObject_Register'],
    CognitoIdentityCredentials_Construct: function (identityPoolIdParam, regionParam) {
        var instance =  new Module['AWS'].CognitoIdentityCredentials({
            IdentityPoolId: Pointer_stringify(identityPoolIdParam)
        },{
            region: Pointer_stringify(regionParam)
        });
   
        return _NativeObject_Register(instance);
    },

    CognitoIdentityCredentials_Destroy__deps: ['NativeObject_Release'],
    CognitoIdentityCredentials_Destroy: function (nativeId) {
        _NativeObject_Release(nativeId);
    },

    CognitoIdentityCredentials_GetCredentials__deps: ['NativeObject_Get', 'Utility_GetPointerFromStr'],
    CognitoIdentityCredentials_GetCredentials: function (nativeId, requestId, onSuccess, onError) {
        var instance = _NativeObject_Get(nativeId);

        instance.refresh(function (err) {
            if (err) {
                Runtime.dynCall('vii', onError, [
                    _Utility_GetPointerFromStr(err.code),
                    _Utility_GetPointerFromStr(err.message)
                ]);
            }
            else {
                Runtime.dynCall('viiii', onSuccess, [
                    requestId,
                    _Utility_GetPointerFromStr(instance.accessKeyId),
                    _Utility_GetPointerFromStr(instance.secretAccessKey),
                    _Utility_GetPointerFromStr(instance.sessionToken)
                ]);
            }
        });
    }
};

var SQS = {
    SQS_Construct__deps: ['NativeObject_Register'],
    SQS_Construct: function (accessKey, secretKey, token, regionParam) {
        var instance =  new Module['AWS'].SQS({
            accessKeyId: Pointer_stringify(accessKey),
            secretAccessKey: Pointer_stringify(secretKey),
            sessionToken: Pointer_stringify(token),
            region: Pointer_stringify(regionParam)
        });

        return _NativeObject_Register(instance);
    },

    SQS_Destroy__deps: ['NativeObject_Release'],
    SQS_Destroy: function (nativeId) {
        _NativeObject_Release(nativeId);
    },

    SQS_DeleteMessageAsync__deps: ['NativeObject_Get', 'Utility_InvokeWebGLCallback'],
    SQS_DeleteMessageAsync: function (nativeId, request, callback, callId) {
        var instance = _NativeObject_Get(nativeId);
        var r = JSON.parse(Pointer_stringify(request));

        instance.deleteMessage(r, function(err, data){
            if (err) {
                _Utility_InvokeWebGLCallback(callback, callId, JSON.stringify(err), 1);
            }
            else {
                _Utility_InvokeWebGLCallback(callback, callId, JSON.stringify(data), 0);
            }
        });
    },
    
    SQS_DeleteMessageBatchAsync__deps: ['NativeObject_Get', 'Utility_InvokeWebGLCallback'],
    SQS_DeleteMessageBatchAsync: function (nativeId, request, callback, callId) {
        var instance = _NativeObject_Get(nativeId);
        var r = JSON.parse(Pointer_stringify(request));

        instance.deleteMessageBatch(r, function(err, data){
            if (err) {
                _Utility_InvokeWebGLCallback(callback, callId, JSON.stringify(err), 1);
            }
            else {
                _Utility_InvokeWebGLCallback(callback, callId, JSON.stringify(data), 0);
            }
        });
    },
    
    SQS_ReceiveMessageAsync__deps: ['NativeObject_Get', 'Utility_InvokeWebGLCallback'],
    SQS_ReceiveMessageAsync: function (nativeId, request, callback, callId) {
        var instance = _NativeObject_Get(nativeId);
        var r = JSON.parse(Pointer_stringify(request));

        instance.receiveMessage(r, function(err, data){
            if (err) {
                _Utility_InvokeWebGLCallback(callback, callId, JSON.stringify(err), 1);
            }
            else {
                _Utility_InvokeWebGLCallback(callback, callId, JSON.stringify(data), 0);
            }
        });
    },
};

mergeInto(LibraryManager.library, Utility);
mergeInto(LibraryManager.library, NativeObject);
mergeInto(LibraryManager.library, CognitoIdentityCredentials);
mergeInto(LibraryManager.library, SQS);