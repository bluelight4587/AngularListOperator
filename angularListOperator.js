/*!
 *
 Author: Robert Ding
 Email:bluelight4587@163.com
 *
 AngularListOperator - v1.1 (2018-01-18)
 for operate object list(add,change,delete/multi delete)
 *
 Need AngularJS (https://angularjs.org/)
 *
 API:
 	attribute list:
 		items: the item array which will be operate.
 		tempItem: a single default template item.
 		
 	function list:
		SelectItem: add/delete a selected tag for multi delete operate.
		AddItem: add a new item like "tempItem".
		DeleteItem: delete a singel item.
		DeleteItems: delete multi items which be selected function "SelectItem". 
		ChangeStatus: an item which be changed should run this function if it need to be save.
		GetEditedItems: get all new item, changed item and deleted item in a object list.
 
 Usage example:
 	$scope.opr=CreateAngularListOperator(items,tempItem);
  	$scope.opr.AddItem();
 
 */

/*!Get a AngularListOperator object/ AngularListOperator object factory
 * parameters
 	items: the item array which will be operate.  e.g. [{name:Robert, age:34},{name:Ada, age:203},{name:Turing, age:106},...]
 	tempItem: a single default template item.  e.g. {name:Robert, age:34}
 	
 * return
 	AngularListOperator object
*/
function CreateAngularListOperator(items,tempItem){
	var alo = new AngularListOperator(items,tempItem);
	alo.Initial();
	return alo;
}

/*!AngularListOperator object
 * parameters
 	items: the item array which will be operate.
 	tempItem: a single default template item.
 	
 * return
*/
function AngularListOperator(items,tempItem){
	this.tempItem={};
	this.items=[];
	
	this.tempItem=tempItem;
	this.items=items;
	
	//operate tag values
	this.operate={
			opr_id:{name:"opr_id"},
    		opr_display:{name:"opr_display",enum:{"display":true,"hidden":false}},
    		opr_status:{name:"opr_status",enum:{"add":"a","remove":"d","change":"u","search":"s"}},
    		opr_checked:{name:"opr_checked",enum:{"checked":"true","unchecked":"false"}}
    };
	
	this.changedItems=[];
    
    this.selectedItems=[];
    
}

/*!AngularListOperator function list*/
AngularListOperator.prototype={
		
		constructor : AngularListOperator,
		
		/*!Add operate attribute for all items
		 * parameters

		 * return

		*/
		Initial:function(){
			this.tempItem[this.operate.opr_display.name]=this.operate.opr_display.enum.display;
			this.tempItem[this.operate.opr_status.name]=this.operate.opr_status.enum.add;
			this.tempItem[this.operate.opr_checked.name]=this.operate.opr_checked.enum.unchecked;
			for(var i=0;i<this.items.length;i++)
		    {
		    	this.items[i][this.operate.opr_id.name]=i;
		    	this.items[i][this.operate.opr_display.name]=this.operate.opr_display.enum.display;
		    	this.items[i][this.operate.opr_status.name]=this.operate.opr_status.enum.search;
		    	this.items[i][this.operate.opr_checked.name]=this.operate.opr_checked.enum.unchecked;
		    }
		},
		
		/*!Record selected item list
		 * parameters
		 	item: selected item.
		 	
		 * return
		 	
		*/
		SelectItem:function(item){
			if(item.opr_checked==this.operate.opr_checked.enum.unchecked)
			{
				this.selectedItems.push(item);
				item.opr_checked=this.operate.opr_checked.enum.checked;
			}
			else
			{
				for(var i=0,len=this.selectedItems.length; i<len; i++)
		  		{
		  			if(this.selectedItems[i].opr_id==item.opr_id)
		  			{
		  				this.selectedItems.splice(i,1);
		  			}
		  		}
		  		
				item.opr_checked=this.operate.opr_checked.enum.unchecked;
			}
		},
		
		/*!Add a new item
		 * parameters
		 	
		 * return
		 	
		*/
		AddItem:function(){
			var newItem={};
			angular.copy(this.tempItem,newItem);
			newItem.opr_id = this.items.length;
			this.items.push(newItem);
		},
		
		/*!Get all operated items list(added,deleted,changed)
		 * parameters
		 	
		 * return
		 	item list
		*/
		GetEditedItems:function(){
			for(var i=0,len=this.items.length; i<len; i++)
			{
				if(this.items[i].opr_status!=this.operate.opr_status.enum.search)
				{
					this.changedItems.push(this.items[i]);
				}
			}
			
			return this.changedItems;
		},
		
		/*!Delete a single item
		 * parameters
		 	item: the item which need be deleted.
		 	showConfirm: display confirm information
		 	confirmString: custom confirm information
		 	
		 * return
			
		*/
		DeleteItem:function(item,showConfirm,confirmString){
			if(showConfirm){
				if(confirm(confirmString))
				{
					item.opr_display=this.operate.opr_display.enum.hidden;
					item.opr_status=this.operate.opr_status.enum.remove;
				}
			}
			else{
				item.opr_display=this.operate.opr_display.enum.hidden;
				item.opr_status=this.operate.opr_status.enum.remove;
			}
			
			
		},
		
		/*!Delete selected items
		 * parameters
		 	showConfirm: display confirm information
		 	confirmString: custom confirm information
		 	
		 * return
		 	
		*/
		DeleteItems:function(showConfirm,confirmString){
			if(this.selectedItems.length>0)
			{
				if(showConfirm){
					if(confirm(confirmString))
					{
						for(var i=0,len=this.items.length; i<len; i++)
			  			{
							if(this.items[i].opr_checked==this.operate.opr_checked.enum.checked)
							{
								this.DeleteItem(this.items[i],false,"");
							}
			  			}
						this.selectedItems=[];
					}
				}
				else{
					this.DeleteItem(this.items[i],false,"");
				}
			}
			else
			{
				alert("Nothing selected");
			}
		},
		
		/*!Add a operate tag on items
		 * parameters
		 	item: the item which be operated.
		 	tag: a tag come from this.operate.opr_status.enum("add":"a"; "remove":"d"; "change":"u"; "search":"s")
		 	
		 * return
		 	
		*/
		ChangeStatus:function(item, tag){
			if(item.opr_status!=this.operate.opr_status.enum.add)
			{item.opr_status=tag;}
		},
		
}



