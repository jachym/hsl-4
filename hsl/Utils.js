Ext.namespace("HSL","HSL.Utils");
HSL.Utils.decorate = function() {
        
    if (window.Ext) {

        Ext.override(Ext.panel.Panel, {

            _win: undefined,
            _helpWin: undefined,
            _ownerCt: undefined,
            helpLink: undefined,
            
            makeDockable: function() {

                var tools = [];

                if (this.docked === true) {
                    return;
                }

                if (this.helpLink /*this.getTool("help")*/) {
                    tools.push({type:"help",itemId:"help",qtip:OpenLayers.i18n("Help"), scope: this, handler:this._onHelp});
                }

                tools.push({type:"unpin",itemId:"unpin",scope:this,handler:this.undock,qtip: "Dock"});

                if (this.closable) {
                    tools.push({type:"close",itemId:"close",scope: this, handler:this._onCancel, qtip: OpenLayers.i18n("Close")});
                }

                if (this.rendered) {
                    this.addTools(tools);
                }
                else {
                    if (this.tools) {
                        this.tools = this.tools.concat(tools);
                    }
                    else {
                        this.tools = tools;
                    }
                }

                this.addEvents("docked","undocked");
                this.docked = true;
            },
            
            /**
             * undock function
             */
            undock: function() {

                // get origin
                if (this.ownerCt) {
                    this._ownerCt = this.ownerCt;
                }

                // get index and redraw
                var itemNr = this._ownerCt.items.findIndex("id",this.id);
                this.expand();

                // get size
                var h,w;
                if (this.getEl()) {
                    h = this.getEl().getHeight();
                    w = this.getEl().getWidth();
                }
                else {
                    h = this.initialConfig.height || 300;
                    w = this.initialConfig.width || 300;
                }

                // remove from parent
                this._ownerCt.remove(this,false);

                this.ownerCt = undefined;

                // prepare tools
                var tools = [];
                if (this.helpLink /*this.getTool("help")*/) {
                    tools.push({type:"close",itemId:"help", qtip:OpenLayers.i18n("Help"), scope: this, handler:this._onHelp});
                }
                tools.push(this._getPinTool("unpin"));

                var header  =  this.getDockedItems('header[dock="top"]')[0];
                if (header) {
                    var pintool =  header.getComponent("unpin");
                    header.remove(pintool);
                }


                // create window object
                this._win = Ext.create("Ext.window.Window",{
                        title: this.title,
                        constrain: true,
                        items: [this],
                        collapsible:true,
                        maximizable: true,
                        autoDestroy: true,
                        closable: this.closable,
                        width: w,
                        height: h,
                        listeners: {
                            scope:this._win
                        },
                        tools: tools
                });

                this._ownerCt.doLayout();
                this._win.show();
                this.doLayout();

                this._win.on("resize",function(p,w,h){
                                this.setHeight(h-30);
                                this.setWidth(w-12);
                                },this);

                this._win.fireEvent("resize","p",w,h);

                this.docked = false;
                this.fireEvent("undocked");
            },


            /**
             * dock function
             */
            dock : function() {
                
                // remove from window
                this._win.remove(this,false);

                // some rerendering
                for (var i = 0; i < this._ownerCt.items.length; i++) {
                    var item = this._ownerCt.items.get(i);
                    item.collapse();
                    item.doLayout();
                }

                this.addTool(this._getPinTool(false));

                // add to origin
                this._ownerCt.add(this);

                this.expand();
                this._ownerCt.doLayout();
                this._win.destroy();
                this.fireEvent("docked");
            },

            _getPinTool: function(pin) {
                return {
                    itemId: pin ? "pin":"unpin",
                    type:   pin ? "pin":"unpin",
                    qtip: OpenLayers.i18n('Redock to original parent'),
                    handler: pin ? this.dock : this.undock,
                    scope: this
                };
            },

            _onCancel: function() {
                if (this.ownerCt) {
                    this.ownerCt.remove(this);
                }
                if (this._win) {
                    this._win.close();
                }
            },

            _onHelp: function(evt, button, panel, config,lang) {
                var w = window.open(this.helpLink, "help");
                w.focus();
                return;
                var path = panel._getHelpUrl();
                if (panel._helpWin) {
                    panel._helpWin.hide();
                    panel._helpWin.destroy();
                }
                panel._helpWin = new Ext.ToolTip({
                    title: OpenLayers.i18n("Help for")+" "+panel.title || panel.CLASS_NAME,
                    html: null,
                    width: 400,
                    height: 400,
                    autoScroll:true,
                    anchor: "top",
                    target: button,
                    preventBodyReset: true,
                    autoHide: false,
                    closable: true,
                    autoLoad: {
                        url: path,
                        nocache: true,
                        scripts: true,
                        text: OpenLayers.i18n("Loading help ..."),
                        lang: lang,
                        target: button,
                        callback: panel._onHelpArrived,
                        scope: panel
                    }
                });
                //win.showAt(evt.xy);
                panel._helpWin.show();
            },

            _getHelpUrl: function(lang) {
                var hslpath =  HSLayers.getLocation();
                if (hslpath.search("build") > -1) {
                    return hslpath + "/help/"+ (lang || OpenLayers.Lang.getCode())+"/"+this.CLASS_NAME+".html";
                }
                else {
                    return hslpath + "/../../resources/help/"+ (lang || OpenLayers.Lang.getCode())+"/"+this.CLASS_NAME+".html";
                }
            },



        }); // /docking panel

        Ext.override(Ext.Component, {

            setMap: function(map) {
                this.map = map;

                this.items.each(function(item,idx,length) {
                    if (item.setMap) {
                        item.setMap(this.map);
                    }
                },{map:map});
            },

            getMap: function() {
                return this.map;
            }
        });
    }
}; 
