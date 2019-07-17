/*:
-------------------------------------------------------------------------
@title Overriding States
@author Hime --> HimeWorks (http://himeworks.com)
@date Nov 18, 2015
@filename HIME_OverridingStates.js
@url http://himeworks.com/2015/11/overriding-states/

If you enjoy my work, consider supporting me on Patreon!

https://www.patreon.com/himeworks

If you have any questions or concerns, you can contact me at any of
the following sites:

Main Website: http://himeworks.com
Facebook: https://www.facebook.com/himeworkscom/
Twitter: https://twitter.com/HimeWorks
Youtube: https://www.youtube.com/c/HimeWorks
Tumblr: http://himeworks.tumblr.com/
-------------------------------------------------------------------------
@plugindesc Allows you to create states that will remove other states
when the state is added
@help 
-------------------------------------------------------------------------
== Description ==

Video: https://www.youtube.com/watch?v=SG63gdHcUXo

Do you want to have states that can remove other states? For example,
you have two types of poison states: Weak Poison, and Strong Poison.
When the Weak Poison state is applied, you lose 5% of your HP. However,
when the Strong Poison is applied, you lose 10% of your HP.

Now, you also have a special case where applying strong poison state will
remove the weak poison state automatically.

With this plugin, you can indicate whether your states will remove other
states when they are added.

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Contact me for commercial use

== Change Log ==

Nov 18, 2015 -  initial release

== Usage ==

To have a state override or remove another state when it is added, go
to your states database and in the note box, write this note-tag:

  <override state: STATE_ID>
  
Where the STATE_ID is the ID of the state that it will override when
added.

A single state can override multiple states. Simply add more note-tags.

-------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.OverridingStates = 1;
TH.OverridingStates = TH.OverridingStates || {};

(function ($) {

  $.Regex = /<override[-_ ]state:\s*(\d+)\s*>/img

  $.overriddenStates = function(state) {
    if (state.overriddenStates !== undefined) {
      return state.overriddenStates;
    }
    state.overriddenStates = []
    var res;
    while (res = $.Regex.exec(state.note)) {
      var id = Math.floor(res[1]);
      state.overriddenStates.push(id)
    }
    return state.overriddenStates;
  }

  var TH_OverridingStates_GameBattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
  Game_BattlerBase.prototype.addNewState = function(stateId) {
    TH_OverridingStates_GameBattlerBase_addNewState.call(this, stateId);
    this.removeOverriddenStates(stateId);
  };
  
  /* Removes any states that should be overridden */
  Game_BattlerBase.prototype.removeOverriddenStates = function(stateId) {
    var state = $dataStates[stateId];
    var toRemove = $.overriddenStates(state);
    for (var i = 0, len = toRemove.length; i < len; i++) {
      this.removeState(toRemove[i]);
    }
  };
})(TH.OverridingStates);