/*
 ---
 description: mooChecka, checkbox element styling replacement

 license:
 MIT-style

 authors:
 - Ferdi van der Werf

 requires:
 core/1.4.2: '*'

 provides: [Element]

 ...
 */

var mooChecka = new Class({

    version: 0.1,

    updated: "15/12/2011",

    Implements: [Options,Events],

    // Default options
    // Don't change these here but on the instance (unless you want to)
    options: {
        selector:     "checka",         // Default selector
        triggerClass: "checka-trigger", // Class of the replacement div
        wrapperClass: "checka-wrapper", // Class of the wrapper div
        textClass:    "checka-text",     // Class of the text div
        knobClass:    "checka-knob",    // Class of the knob
        onClass:      "checka-on",      // Class of the on state
        offClass:     "checka-off",     // Class of the off state
        oneClass:     "checka-one",     // Class of the '1'
        zeroClass:    "checka-zero"     // Class of the '0'
    },

    // Startup
    initialize: function(options) {
        // Start everything
        this.setOptions(options);

        // Locate and apply checkboxes to all required ones
        var checkboxes = $$('input.'+this.options.selector+'[type=checkbox');

        if(!checkboxes.length)
            return "Nothing to do, selector came up empty!";

        checkboxes.each(this.replaceCheckbox.bind(this));
    },

    // Public method that replaces checkboxes
    replaceCheckbox: function(el) {
        var el = document.id(el); // Adds uid

        if(!el)
            return;

        // Clean up old instances
        if(el.retrieve("triggerElement"))
            el.retrieve("triggerElement").dispose();
        if(el.retrieve("wrapper"))
            el.retrieve("wrapper").dispose();

        // Build the top visible element
        var te = new Element("div", {
            "class": this.options.triggerClass
        }).inject(el, "after")
        el.store("triggerElement", te);

        // Build the checkbox
        var wrapper = new Element('div', {
            'class': this.options.wrapperClass
        }).inject(te);
        el.store("wrapper", wrapper);

        // Initial state
        if(el.checked)
            wrapper.addClass(this.options.onClass);
        else
            wrapper.addClass(this.options.offClass);

        // One and Zero
        var one = new Element('div', {
            'class': this.options.oneClass,
            text: '1'
        }).inject(wrapper);

        var zero = new Element('div', {
            'class': this.options.zeroClass,
            text: '0'
        }).inject(wrapper);

        // Knob
        var knob = new Element('div', {
            'class': this.options.knobClass
        }).inject(wrapper);

        // Original text
        if(el.get('title') != "")
        {
            var txt = new Element('div', {
                'class': this.options.textClass,
                text: el.get('title')
            }).inject(te);
        }

        // Hide the original checkbox off-screen
        // This is so the tab indexing and by-label focus works and hands us back control.
        el.set({
            styles: {
                position: "absolute",
                top: -1000000
            }
        });

        // Events
        knob.addEvent('click', function() {
            if(wrapper.hasClass(this.options.onClass))
            {
                wrapper.removeClass(this.options.onClass);
                wrapper.addClass(this.options.offClass);
                el.checked = false;
            }
            else
            {
                wrapper.removeClass(this.options.offClass);
                wrapper.addClass(this.options.onClass);
                el.checked = true;
            }
        }.bind(this));

        // Export the managed select to the hash
        if(el.uid && el)
            this.checkboxes[el.uid] = el;
    }
}); // mooChecka
