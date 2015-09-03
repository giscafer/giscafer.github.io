(function($){
	$('#archive_list_button').click(function(){
		if($(this).hasClass("list_closed")){
			$("#archivelist_display").show();
			$("#archive_list_button").html('收起');
			$(this).removeClass("list_closed").addClass("list_opended");
			
		}else{
			$("#archivelist_display").hide();
			$("#archive_list_button").html('展开');
			$(this).removeClass("list_opended").addClass("list_closed");
		}
	});
})(jQuery);