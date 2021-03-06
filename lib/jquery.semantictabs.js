/*
jquery.semantictabs.js
Creates semantic tabs from nested divs
Chris Yates

Inspired by Niall Doherty's jQuery Coda-Slider v1.1 - http://www.ndoherty.com/coda-slider

Copyright (C) 2007-2011 Chris Yates

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Usage:
$("#mycontainer").semantictabs({
  panel:'.mypanelclass',        //-- Selector of individual panel body
  head:'headelement',           //-- Selector of element containing panel header
  removeHead:false,             //-- Whether or not to remove the above header element from the DOM
  active:':first',              //-- Which panel to activate by default
  activate:':eq(2)',            //-- Argument used to activate panel programmatically
  tabsUseHtmlContent:false,     //-- Use HTML content of the head (instead of the text version)
  maxTabsInTabContainer:-1,     //-- Further tabs go in a new tab list under the panels. Set to -1 for no maximum
  autoHideAndShowPanels:true    //-- If false, you must manually hide the inactive panels with CSS (useful in responsive designs)
});

1 Nov 2007

Bug fixes 15 Dec 2009:
http://plugins.jquery.com/node/11834
http://plugins.jquery.com/node/8486
(thanks zenmonkey)

Feature update 4 Jan 2010:
Now works with arbitrary jQuery selectors, not just 'class' attribute.

*/

jQuery.fn.semantictabs = function(passedArgsObj) {
  /* defaults */
  var defaults = {
    panel:'.panel',
    head:'h3',
    removeHead:false,
    active:':first',
    activate:false,
    tabsUseHtmlContent:false,
    maxTabsInTabContainer:-1,
    autoHideAndShowPanels:true
  };

  /* override the defaults if necessary */
  var args = jQuery.extend(defaults,passedArgsObj);

  // Allow activation of specific tab, by index
  if (args.activate) {
    return this.each(function(){
      var container = jQuery(this);
      var panels = container.find(args.panel).removeClass("active");
      if (args.autoHideAndShowPanels) {
        panels.hide();
      }
      container.find("ul.tabs li").removeClass("active");
      var activePanel = container.find(args.panel + ":eq(" + args.activate + ")").addClass("active");
      if (args.autoHideAndShowPanels) {
        activePanel.show();
      }
      container.find("ul.tabs li:eq(" + args.activate + ")").addClass("active");
    });
  } else {
    return this.each(function(){
      // Load behavior
      var container = jQuery(this);
      var previousPanel = container.find(args.panel).removeClass("active");
      if (args.autoHideAndShowPanels) {
        previousPanel.hide()
      }
      var activePanel = container.find(args.panel + args.active).addClass("active");
      if (args.autoHideAndShowPanels) {
        activePanel.show()
      }
      container.prepend("<ul class=\"tabs semtabs\"></ul>");
      container.find(args.panel).each( function() {
        if (args.tabsUseHtmlContent) {
          var tabHtmlContent = jQuery(this).find(args.head).html();
          var $tab = jQuery('<li>' + tabHtmlContent + '</li>');
        } else {
          var title = jQuery(this).find(args.head).text();
          var href = "#" + jQuery(this).attr("id");
          var $tab = jQuery('<li><a href="' + href + '">' + title + '</a></li>');
        }

        var $tabContainer = container.find("ul.tabs");
        if($tabContainer.length > 1) {
          $tabContainer = $tabContainer.last();
        } else if(args.maxTabsInTabContainer > 0 && $tabContainer.children().length >= args.maxTabsInTabContainer) {
          // Make the overflow container and use it
          $tabContainer = jQuery("<ul class=\"tabs semtabs overflow\"></ul>");
          $tabContainer.appendTo(container);
        }

        // Use cursor: pointer for the whole list item, since the click handler is on the LI
	    $tabContainer.append($tab.data('panel', jQuery(this).attr("id")).css('cursor', 'pointer'));
	    
	    // Activate the tab corresponding to the active panel
	    if($(this).hasClass('active')) {
	      $tab.addClass("active");
	    }
      });

      // Remove titles if removeHead is TRUE
      if(args.removeHead){ container.find(args.head).remove(); }

      // Tab click behavior
      container.find("ul.tabs li").click(function(e){
        var previousPanel = container.find(args.panel).removeClass("active");
        if (args.autoHideAndShowPanels) {
          previousPanel.hide()
        }
        container.find("ul.tabs li").removeClass("active");
        var activePanel = container.find('#' + jQuery(this).data('panel')).addClass("active");
        if (args.autoHideAndShowPanels) {
          activePanel.show();
        }
        jQuery(this).addClass("active");
      });
      // Suppress the default click handler on the links
      container.find("ul.tabs a").click(function(e){
        e.preventDefault();
      });
      container.find("#remtabs").click(function(){
        container.find("ul.tabs").remove();
        var activePanel = container.find(args.container + " " + args.panel).addClass("active");
        if (args.autoHideAndShowPanels) {
          activePanel.show();
        }
        container.find("#remtabs").remove();
      });
    });
  }
};