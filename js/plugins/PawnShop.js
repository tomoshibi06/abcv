//=============================================================================
// PawnShop.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 売却専門ショップを作ります
 * @author まっつＵＰ
 * 
 * @param nobuy
 * @desc このIDのスイッチがオンの時は購入が選べない。
 * @default 10
 * 
 * @param category
 * @desc このIDの変数の値でカテゴリを限定する。（ヘルプ参照）
 * @default 10 
 * 
 * @param sellprice
 * @desc このIDの変数の値を百分率で評価して売却額に乗算する。
 * @default 11
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * nobuyに設定したIDのスイッチがオンの時は購入が選べなくなります。
 * 「購入のみ」のチェックを無効化するわけではないことに注意してください。
 * 
 * category このパラメータに設定したIDの変数によって売却可能なアイテムのカテゴリを決定します。
 * カテゴリは「アイテム」「武器」「防具」「大事なもの」の4つです。（デフォルトのまま）
 * 
 * 0:全カテゴリを選択可能。
 * 1:「アイテム」カテゴリのみ選択可能。
 * 2:「武器」カテゴリのみ選択可能。
 * 3:「防具」カテゴリのみ選択可能。
 * 4:「大事なもの」カテゴリのみ選択可能。
 * 5:「アイテム」「大事なもの」カテゴリのみ選択可能。
 * 6:「武器」「防具」カテゴリのみ選択可能。
 * それ以外の値:全カテゴリが選択不可能。
 * 
 * なお、このパラメータに設定したIDの変数はショップコマンドの「やめる」を選ぶと0が代入されます。
 * 
 * sellpriceに設定したIDの変数で売却額を変えることができます。
 * 例えば変数に100が代入されていればデフォルトのままの買値の半額ですし
 * 変数に150が代入されていればその1.5倍の金額で売却することができます。
 * 変数が0以下の値でも計算されますので売ると損する役立たずの店員を作ることもできます。
 *  
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {
    
    var parameters = PluginManager.parameters('PawnShop');
    var PSnobuy = Number(parameters['nobuy'] || 10);
    var PScategory = Number(parameters['category'] || 10);
    var PSsellprice = Number(parameters['sellprice'] || 11);
    
    Window_ItemCategory.prototype.makeCommandList = function() { //各コマンドに条件を追加
    var ca = $gameVariables.value(PScategory); //変数の値で判断する
    this.addCommand(TextManager.item,    'item', ca === 0 || ca === 1 || ca === 5); 
    this.addCommand(TextManager.weapon,  'weapon', ca === 0 || ca === 2 || ca === 6);
    this.addCommand(TextManager.armor,   'armor', ca === 0 || ca === 3 || ca === 6);
    this.addCommand(TextManager.keyItem, 'keyItem', ca === 0 || ca === 4 || ca === 5);
    };
    
    Window_ShopCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.buy,    'buy', !$gameSwitches.value(PSnobuy)); //スイッチによって購入を禁止
    this.addCommand(TextManager.sell,   'sell',   !this._purchaseOnly);
    this.addCommand(TextManager.cancel, 'cancel');　//Scene_Base.prototype.popScene();の効果
    };
    
    var _Scene_Base_popScene = Scene_Base.prototype.popScene;
    Scene_Base.prototype.popScene = function() {
    _Scene_Base_popScene.call(this);
    //SceneManager.pop();
    $gameVariables.setValue(PScategory,0); //カテゴリ限定用の変数を初期化
    };
    
    Scene_Shop.prototype.sellingPrice = function() {
    var se = $gameVariables.value(PSsellprice);
    return Math.floor(this._item.price / 2 * se / 100); //計算式を改変した
    };
      
})();
