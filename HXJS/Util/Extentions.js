Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

Array.prototype.slice2 = function (start, count) {
    return this.slice(start, start + count);
};

Array.prototype.remove = function (item) {
    var idx = this.indexOf(item);
    this.splice(idx, 1);
};

Array.prototype.removeAt = function (idx) {
    this.splice(idx, 1);
};

Array.prototype.copyAll = function () {
    return this.concat();
};


//String
String.prototype.toBool = function() { 
    return (/^true$/i).test(this); 
}; 

///////////////////////////////////////////////////////////////////////////////////////
//for perticular project
Number.prototype.toInt = function () {
    return parseInt(this);
}
Number.prototype.toCoin = function () {
    var txtStyle = '';

    var intThis = this.toInt();

    if(intThis>=10000) {
        if(intThis>=100000000) {
            txtStyle = parseInt(this/100000000 * 100)/100 + '亿';
        }
        else if(intThis>=10000000) {
            txtStyle = parseInt(this/10000)+ '万';
        }
        else {
            txtStyle = parseInt(this/10000 * 100)/100 + '万';
        }
    }
    else{
        txtStyle = Math.max(0,this)+'';
    }
    // cc.log('~~~~~~~~~number to coin: ' + this);
    return txtStyle;
};