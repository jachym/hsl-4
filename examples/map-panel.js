Ext.application({
    requires: ['HSL.panel.MapPanel',"HSL.Utils"],
    name: 'Map panel example',

    paths: {
        HSL: "../hsl/"
    },

    launch: function() {
        HSL.Utils.decorate();

        // define map panel
        var panel = Ext.create('HSL.panel.MapPanel', {
            renderTo: Ext.getBody(),
            width: 400,
            height: 400
        });

        var map = new OpenLayers.Map({
            layers: [new OpenLayers.Layer.WMS("WMS",
                "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'})
            ]
        });
        panel.setMap(map);
        map.zoomToMaxExtent();
        console.log(panel.body.id);

    }
});
