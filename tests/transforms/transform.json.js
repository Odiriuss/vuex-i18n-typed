const map = {
	list : 'translations',
	item: {
		Key: 'Key',
		Value: 'Value'
     },
     each: function(item){
		item[item.Key] = item.Value;
        delete item['Key'];
        delete item['Value'];
        
		return item;
	}
};

module.exports = { map };