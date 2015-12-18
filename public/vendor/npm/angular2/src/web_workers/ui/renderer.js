'use strict';var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var di_1 = require('angular2/src/core/di');
var message_bus_1 = require('angular2/src/web_workers/shared/message_bus');
var serializer_1 = require('angular2/src/web_workers/shared/serializer');
var api_1 = require('angular2/src/core/render/api');
var api_2 = require('angular2/src/web_workers/shared/api');
var messaging_api_1 = require('angular2/src/web_workers/shared/messaging_api');
var bind_1 = require('./bind');
var event_dispatcher_1 = require('angular2/src/web_workers/ui/event_dispatcher');
var render_proto_view_ref_store_1 = require('angular2/src/web_workers/shared/render_proto_view_ref_store');
var render_view_with_fragments_store_1 = require('angular2/src/web_workers/shared/render_view_with_fragments_store');
var service_message_broker_1 = require('angular2/src/web_workers/shared/service_message_broker');
var MessageBasedRenderer = (function () {
    function MessageBasedRenderer(_brokerFactory, _bus, _serializer, _renderProtoViewRefStore, _renderViewWithFragmentsStore, _renderer) {
        this._brokerFactory = _brokerFactory;
        this._bus = _bus;
        this._serializer = _serializer;
        this._renderProtoViewRefStore = _renderProtoViewRefStore;
        this._renderViewWithFragmentsStore = _renderViewWithFragmentsStore;
        this._renderer = _renderer;
    }
    MessageBasedRenderer.prototype.start = function () {
        var broker = this._brokerFactory.createMessageBroker(messaging_api_1.RENDERER_CHANNEL);
        this._bus.initChannel(messaging_api_1.EVENT_CHANNEL);
        broker.registerMethod("registerComponentTemplate", [api_1.RenderComponentTemplate], bind_1.bind(this._renderer.registerComponentTemplate, this._renderer));
        broker.registerMethod("createProtoView", [serializer_1.PRIMITIVE, api_2.WebWorkerTemplateCmd, serializer_1.PRIMITIVE], bind_1.bind(this._createProtoView, this));
        broker.registerMethod("createRootHostView", [api_1.RenderProtoViewRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._createRootHostView, this));
        broker.registerMethod("createView", [api_1.RenderProtoViewRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._createView, this));
        broker.registerMethod("destroyView", [api_1.RenderViewRef], bind_1.bind(this._destroyView, this));
        broker.registerMethod("attachFragmentAfterFragment", [api_1.RenderFragmentRef, api_1.RenderFragmentRef], bind_1.bind(this._renderer.attachFragmentAfterFragment, this._renderer));
        broker.registerMethod("attachFragmentAfterElement", [api_2.WebWorkerElementRef, api_1.RenderFragmentRef], bind_1.bind(this._renderer.attachFragmentAfterElement, this._renderer));
        broker.registerMethod("detachFragment", [api_1.RenderFragmentRef], bind_1.bind(this._renderer.detachFragment, this._renderer));
        broker.registerMethod("hydrateView", [api_1.RenderViewRef], bind_1.bind(this._renderer.hydrateView, this._renderer));
        broker.registerMethod("dehydrateView", [api_1.RenderViewRef], bind_1.bind(this._renderer.dehydrateView, this._renderer));
        broker.registerMethod("setText", [api_1.RenderViewRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.setText, this._renderer));
        broker.registerMethod("setElementProperty", [api_2.WebWorkerElementRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.setElementProperty, this._renderer));
        broker.registerMethod("setElementAttribute", [api_2.WebWorkerElementRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.setElementAttribute, this._renderer));
        broker.registerMethod("setBindingDebugInfo", [api_2.WebWorkerElementRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.setBindingDebugInfo, this._renderer));
        broker.registerMethod("setElementClass", [api_2.WebWorkerElementRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.setElementClass, this._renderer));
        broker.registerMethod("setElementStyle", [api_2.WebWorkerElementRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.setElementStyle, this._renderer));
        broker.registerMethod("invokeElementMethod", [api_2.WebWorkerElementRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.invokeElementMethod, this._renderer));
        broker.registerMethod("setEventDispatcher", [api_1.RenderViewRef], bind_1.bind(this._setEventDispatcher, this));
    };
    MessageBasedRenderer.prototype._destroyView = function (viewRef) {
        this._renderer.destroyView(viewRef);
        this._renderViewWithFragmentsStore.remove(viewRef);
    };
    MessageBasedRenderer.prototype._createProtoView = function (componentTemplateId, cmds, refIndex) {
        var protoViewRef = this._renderer.createProtoView(componentTemplateId, cmds);
        this._renderProtoViewRefStore.store(protoViewRef, refIndex);
    };
    MessageBasedRenderer.prototype._createRootHostView = function (ref, fragmentCount, selector, startIndex) {
        var renderViewWithFragments = this._renderer.createRootHostView(ref, fragmentCount, selector);
        this._renderViewWithFragmentsStore.store(renderViewWithFragments, startIndex);
    };
    MessageBasedRenderer.prototype._createView = function (ref, fragmentCount, startIndex) {
        var renderViewWithFragments = this._renderer.createView(ref, fragmentCount);
        this._renderViewWithFragmentsStore.store(renderViewWithFragments, startIndex);
    };
    MessageBasedRenderer.prototype._setEventDispatcher = function (viewRef) {
        var dispatcher = new event_dispatcher_1.EventDispatcher(viewRef, this._bus.to(messaging_api_1.EVENT_CHANNEL), this._serializer);
        this._renderer.setEventDispatcher(viewRef, dispatcher);
    };
    MessageBasedRenderer = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [service_message_broker_1.ServiceMessageBrokerFactory, message_bus_1.MessageBus, serializer_1.Serializer, render_proto_view_ref_store_1.RenderProtoViewRefStore, render_view_with_fragments_store_1.RenderViewWithFragmentsStore, api_1.Renderer])
    ], MessageBasedRenderer);
    return MessageBasedRenderer;
})();
exports.MessageBasedRenderer = MessageBasedRenderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvdWkvcmVuZGVyZXIudHMiXSwibmFtZXMiOlsiTWVzc2FnZUJhc2VkUmVuZGVyZXIiLCJNZXNzYWdlQmFzZWRSZW5kZXJlci5jb25zdHJ1Y3RvciIsIk1lc3NhZ2VCYXNlZFJlbmRlcmVyLnN0YXJ0IiwiTWVzc2FnZUJhc2VkUmVuZGVyZXIuX2Rlc3Ryb3lWaWV3IiwiTWVzc2FnZUJhc2VkUmVuZGVyZXIuX2NyZWF0ZVByb3RvVmlldyIsIk1lc3NhZ2VCYXNlZFJlbmRlcmVyLl9jcmVhdGVSb290SG9zdFZpZXciLCJNZXNzYWdlQmFzZWRSZW5kZXJlci5fY3JlYXRlVmlldyIsIk1lc3NhZ2VCYXNlZFJlbmRlcmVyLl9zZXRFdmVudERpc3BhdGNoZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLG1CQUF5QixzQkFBc0IsQ0FBQyxDQUFBO0FBQ2hELDRCQUF5Qiw2Q0FBNkMsQ0FBQyxDQUFBO0FBQ3ZFLDJCQUFvQyw0Q0FBNEMsQ0FBQyxDQUFBO0FBQ2pGLG9CQU9PLDhCQUE4QixDQUFDLENBQUE7QUFDdEMsb0JBQXdELHFDQUFxQyxDQUFDLENBQUE7QUFDOUYsOEJBQThDLCtDQUErQyxDQUFDLENBQUE7QUFFOUYscUJBQW1CLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLGlDQUE4Qiw4Q0FBOEMsQ0FBQyxDQUFBO0FBQzdFLDRDQUFzQyw2REFBNkQsQ0FBQyxDQUFBO0FBQ3BHLGlEQUVPLGtFQUFrRSxDQUFDLENBQUE7QUFDMUUsdUNBQTBDLHdEQUF3RCxDQUFDLENBQUE7QUFFbkc7SUFFRUEsOEJBQW9CQSxjQUEyQ0EsRUFBVUEsSUFBZ0JBLEVBQ3JFQSxXQUF1QkEsRUFDdkJBLHdCQUFpREEsRUFDakRBLDZCQUEyREEsRUFDM0RBLFNBQW1CQTtRQUpuQkMsbUJBQWNBLEdBQWRBLGNBQWNBLENBQTZCQTtRQUFVQSxTQUFJQSxHQUFKQSxJQUFJQSxD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Q0FBQ0E7SUFDekRBLENBQUNBO0lBM0VIUDtRQUFDQSxlQUFVQSxFQUFFQTs7NkJBNEVaQTtJQUFEQSwyQkFBQ0E7QUFBREEsQ0FBQ0EsQUE1RUQsSUE0RUM7QUEzRVksNEJBQW9CLHVCQTJFaEMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtNZXNzYWdlQnVzfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL21lc3NhZ2VfYnVzJztcbmltcG9ydCB7U2VyaWFsaXplciwgUFJJTUlUSVZFfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtcbiAgUmVuZGVyVmlld1JlZixcbiAgUmVuZGVyRnJhZ21lbnRSZWYsXG4gIFJlbmRlclByb3RvVmlld1JlZixcbiAgUmVuZGVyZXIsXG4gIFJlbmRlclRlbXBsYXRlQ21kLFxuICBSZW5kZXJDb21wb25lbnRUZW1wbGF0ZVxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZW5kZXIvYXBpJztcbmltcG9ydCB7V2ViV29ya2VyRWxlbWVudFJlZiwgV2ViV29ya2VyVGVtcGxhdGVDbWR9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvYXBpJztcbmltcG9ydCB7RVZFTlRfQ0hBTk5FTCwgUkVOREVSRVJfQ0hBTk5FTH0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9tZXNzYWdpbmdfYXBpJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7YmluZH0gZnJvbSAnLi9iaW5kJztcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvdWkvZXZlbnRfZGlzcGF0Y2hlcic7XG5pbXBvcnQge1JlbmRlclByb3RvVmlld1JlZlN0b3JlfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3JlbmRlcl9wcm90b192aWV3X3JlZl9zdG9yZSc7XG5pbXBvcnQge1xuICBSZW5kZXJWaWV3V2l0aEZyYWdtZW50c1N0b3JlXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvcmVuZGVyX3ZpZXdfd2l0aF9mcmFnbWVudHNfc3RvcmUnO1xuaW1wb3J0IHtTZXJ2aWNlTWVzc2FnZUJyb2tlckZhY3Rvcnl9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VydmljZV9tZXNzYWdlX2Jyb2tlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNZXNzYWdlQmFzZWRSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Jyb2tlckZhY3Rvcnk6IFNlcnZpY2VNZXNzYWdlQnJva2VyRmFjdG9yeSwgcHJpdmF0ZSBfYnVzOiBNZXNzYWdlQnVzLFxuICAgICAgICAgICAgICBwcml2YXRlIF9zZXJpYWxpemVyOiBTZXJpYWxpemVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9yZW5kZXJQcm90b1ZpZXdSZWZTdG9yZTogUmVuZGVyUHJvdG9WaWV3UmVmU3RvcmUsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3JlbmRlclZpZXdXaXRoRnJhZ21lbnRzU3RvcmU6IFJlbmRlclZpZXdXaXRoRnJhZ21lbnRzU3RvcmUsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcikge31cblxuICBzdGFydCgpOiB2b2lkIHtcbiAgICB2YXIgYnJva2VyID0gdGhpcy5fYnJva2VyRmFjdG9yeS5jcmVhdGVNZXNzYWdlQnJva2VyKFJFTkRFUkVSX0NIQU5ORUwpO1xuICAgIHRoaXMuX2J1cy5pbml0Q2hhbm5lbChFVkVOVF9DSEFOTkVMKTtcblxuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcInJlZ2lzdGVyQ29tcG9uZW50VGVtcGxhdGVcIiwgW1JlbmRlckNvbXBvbmVudFRlbXBsYXRlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9yZW5kZXJlci5yZWdpc3RlckNvbXBvbmVudFRlbXBsYXRlLCB0aGlzLl9yZW5kZXJlcikpO1xuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcImNyZWF0ZVByb3RvVmlld1wiLCBbUFJJTUlUSVZFLCBXZWJXb3JrZXJUZW1wbGF0ZUNtZCwgUFJJTUlUSVZFXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9jcmVhdGVQcm90b1ZpZXcsIHRoaXMpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJjcmVhdGVSb290SG9zdFZpZXdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW1JlbmRlclByb3RvVmlld1JlZiwgUFJJTUlUSVZFLCBQUklNSVRJVkUsIFBSSU1JVElWRV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fY3JlYXRlUm9vdEhvc3RWaWV3LCB0aGlzKSk7XG4gICAgYnJva2VyLnJlZ2lzdGVyTWV0aG9kKFwiY3JlYXRlVmlld1wiLCBbUmVuZGVyUHJvdG9WaWV3UmVmLCBQUklNSVRJVkUsIFBSSU1JVElWRV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fY3JlYXRlVmlldywgdGhpcykpO1xuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcImRlc3Ryb3lWaWV3XCIsIFtSZW5kZXJWaWV3UmVmXSwgYmluZCh0aGlzLl9kZXN0cm95VmlldywgdGhpcykpO1xuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcImF0dGFjaEZyYWdtZW50QWZ0ZXJGcmFnbWVudFwiLCBbUmVuZGVyRnJhZ21lbnRSZWYsIFJlbmRlckZyYWdtZW50UmVmXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9yZW5kZXJlci5hdHRhY2hGcmFnbWVudEFmdGVyRnJhZ21lbnQsIHRoaXMuX3JlbmRlcmVyKSk7XG4gICAgYnJva2VyLnJlZ2lzdGVyTWV0aG9kKFwiYXR0YWNoRnJhZ21lbnRBZnRlckVsZW1lbnRcIiwgW1dlYldvcmtlckVsZW1lbnRSZWYsIFJlbmRlckZyYWdtZW50UmVmXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9yZW5kZXJlci5hdHRhY2hGcmFnbWVudEFmdGVyRWxlbWVudCwgdGhpcy5fcmVuZGVyZXIpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJkZXRhY2hGcmFnbWVudFwiLCBbUmVuZGVyRnJhZ21lbnRSZWZdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kKHRoaXMuX3JlbmRlcmVyLmRldGFjaEZyYWdtZW50LCB0aGlzLl9yZW5kZXJlcikpO1xuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcImh5ZHJhdGVWaWV3XCIsIFtSZW5kZXJWaWV3UmVmXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9yZW5kZXJlci5oeWRyYXRlVmlldywgdGhpcy5fcmVuZGVyZXIpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJkZWh5ZHJhdGVWaWV3XCIsIFtSZW5kZXJWaWV3UmVmXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9yZW5kZXJlci5kZWh5ZHJhdGVWaWV3LCB0aGlzLl9yZW5kZXJlcikpO1xuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcInNldFRleHRcIiwgW1JlbmRlclZpZXdSZWYsIFBSSU1JVElWRSwgUFJJTUlUSVZFXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9yZW5kZXJlci5zZXRUZXh0LCB0aGlzLl9yZW5kZXJlcikpO1xuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcInNldEVsZW1lbnRQcm9wZXJ0eVwiLCBbV2ViV29ya2VyRWxlbWVudFJlZiwgUFJJTUlUSVZFLCBQUklNSVRJVkVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kKHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRQcm9wZXJ0eSwgdGhpcy5fcmVuZGVyZXIpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJzZXRFbGVtZW50QXR0cmlidXRlXCIsIFtXZWJXb3JrZXJFbGVtZW50UmVmLCBQUklNSVRJVkUsIFBSSU1JVElWRV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudEF0dHJpYnV0ZSwgdGhpcy5fcmVuZGVyZXIpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJzZXRCaW5kaW5nRGVidWdJbmZvXCIsIFtXZWJXb3JrZXJFbGVtZW50UmVmLCBQUklNSVRJVkUsIFBSSU1JVElWRV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcmVuZGVyZXIuc2V0QmluZGluZ0RlYnVnSW5mbywgdGhpcy5fcmVuZGVyZXIpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJzZXRFbGVtZW50Q2xhc3NcIiwgW1dlYldvcmtlckVsZW1lbnRSZWYsIFBSSU1JVElWRSwgUFJJTUlUSVZFXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MsIHRoaXMuX3JlbmRlcmVyKSk7XG4gICAgYnJva2VyLnJlZ2lzdGVyTWV0aG9kKFwic2V0RWxlbWVudFN0eWxlXCIsIFtXZWJXb3JrZXJFbGVtZW50UmVmLCBQUklNSVRJVkUsIFBSSU1JVElWRV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlLCB0aGlzLl9yZW5kZXJlcikpO1xuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcImludm9rZUVsZW1lbnRNZXRob2RcIiwgW1dlYldvcmtlckVsZW1lbnRSZWYsIFBSSU1JVElWRSwgUFJJTUlUSVZFXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9yZW5kZXJlci5pbnZva2VFbGVtZW50TWV0aG9kLCB0aGlzLl9yZW5kZXJlcikpO1xuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcInNldEV2ZW50RGlzcGF0Y2hlclwiLCBbUmVuZGVyVmlld1JlZl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fc2V0RXZlbnREaXNwYXRjaGVyLCB0aGlzKSk7XG4gIH1cblxuICBwcml2YXRlIF9kZXN0cm95Vmlldyh2aWV3UmVmOiBSZW5kZXJWaWV3UmVmKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuZGVzdHJveVZpZXcodmlld1JlZik7XG4gICAgdGhpcy5fcmVuZGVyVmlld1dpdGhGcmFnbWVudHNTdG9yZS5yZW1vdmUodmlld1JlZik7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVQcm90b1ZpZXcoY29tcG9uZW50VGVtcGxhdGVJZDogc3RyaW5nLCBjbWRzOiBSZW5kZXJUZW1wbGF0ZUNtZFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmSW5kZXg6IG51bWJlcikge1xuICAgIHZhciBwcm90b1ZpZXdSZWYgPSB0aGlzLl9yZW5kZXJlci5jcmVhdGVQcm90b1ZpZXcoY29tcG9uZW50VGVtcGxhdGVJZCwgY21kcyk7XG4gICAgdGhpcy5fcmVuZGVyUHJvdG9WaWV3UmVmU3RvcmUuc3RvcmUocHJvdG9WaWV3UmVmLCByZWZJbmRleCk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVSb290SG9zdFZpZXcocmVmOiBSZW5kZXJQcm90b1ZpZXdSZWYsIGZyYWdtZW50Q291bnQ6IG51bWJlciwgc2VsZWN0b3I6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXg6IG51bWJlcikge1xuICAgIHZhciByZW5kZXJWaWV3V2l0aEZyYWdtZW50cyA9IHRoaXMuX3JlbmRlcmVyLmNyZWF0ZVJvb3RIb3N0VmlldyhyZWYsIGZyYWdtZW50Q291bnQsIHNlbGVjdG9yKTtcbiAgICB0aGlzLl9yZW5kZXJWaWV3V2l0aEZyYWdtZW50c1N0b3JlLnN0b3JlKHJlbmRlclZpZXdXaXRoRnJhZ21lbnRzLCBzdGFydEluZGV4KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZpZXcocmVmOiBSZW5kZXJQcm90b1ZpZXdSZWYsIGZyYWdtZW50Q291bnQ6IG51bWJlciwgc3RhcnRJbmRleDogbnVtYmVyKSB7XG4gICAgdmFyIHJlbmRlclZpZXdXaXRoRnJhZ21lbnRzID0gdGhpcy5fcmVuZGVyZXIuY3JlYXRlVmlldyhyZWYsIGZyYWdtZW50Q291bnQpO1xuICAgIHRoaXMuX3JlbmRlclZpZXdXaXRoRnJhZ21lbnRzU3RvcmUuc3RvcmUocmVuZGVyVmlld1dpdGhGcmFnbWVudHMsIHN0YXJ0SW5kZXgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0RXZlbnREaXNwYXRjaGVyKHZpZXdSZWY6IFJlbmRlclZpZXdSZWYpIHtcbiAgICB2YXIgZGlzcGF0Y2hlciA9IG5ldyBFdmVudERpc3BhdGNoZXIodmlld1JlZiwgdGhpcy5fYnVzLnRvKEVWRU5UX0NIQU5ORUwpLCB0aGlzLl9zZXJpYWxpemVyKTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRFdmVudERpc3BhdGNoZXIodmlld1JlZiwgZGlzcGF0Y2hlcik7XG4gIH1cbn1cbiJdfQ==