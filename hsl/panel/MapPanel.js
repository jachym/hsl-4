Ext.define('HSL.panel.MapPanel', {

    extend: "Ext.panel.Panel",

    config: {
        tbar: {
            enabled: true,
            height: 25,
            resizable: false
        },
        bbar: {
            enabled: true,
            height: 25,
            resizable: false
        }
    },

    constructor: function(config) {
        this.callParent(arguments);
        this.initConfig(config);
    },

    setMap: function(map) {
        this.superclass.setMap.apply(this, arguments); 

        var inner = document.getElementById(this.id+"-innerCt");
        inner.parentNode.removeChild(inner);
        this.map.render(this.id+"-outerCt");
        //this.map.render(this.body.id);

        // register add control events
        // scale
        var scales = this.map.getControlsByClass("OpenLayers.Control.ScaleLine");
        if (scales.length > 0) {
            scales[0].div.parentNode.removeChild(scales[0].div);
            this.topBar.add(scales[0].div);
        }
    },

    applyBottomBar: function(bbar) {
        if (bbar && bbar.enabled) {
            if (!this.bottomBar) {
                return Ext.create("Ext.toolbar.Toolbar",bbar);
            }
            else {
                this.bottomBar.setConfig(bbar);
            }
        }
    },

    applyTopBar: function(tbar) {
        if (tbar && tbar.enabled) {
            if (!this.topBar) {
                return Ext.create("Ext.toolbar.Toolbar",tbar);
            }
            else {
                this.topBar.setConfig(tbar);
            }
        }
    }
});
