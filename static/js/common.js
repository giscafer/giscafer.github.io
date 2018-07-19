/**
 * 归档拓展
 */
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
/**
 * 返回顶部
 */
$(function(){
	var $body = $(document.body);;
	var $bottomTools = $('.bottom_tools');
	var $qrTools = $('.qr_tool');
	var qrImg = $('.qr_img');
		$(window).scroll(function () {
			var scrollHeight = $(document).height();
			var scrollTop = $(window).scrollTop();
			var $footerHeight = $('.page-footer').outerHeight(true);
			var $windowHeight = $(window).innerHeight();
			scrollTop > 50 ? $("#scrollUp").fadeIn(200).css("display","block") : $("#scrollUp").fadeOut(200);			
			$bottomTools.css("bottom", scrollHeight - scrollTop - $footerHeight > $windowHeight ? 40 : $windowHeight + scrollTop + $footerHeight + 40 - scrollHeight);
		});
		$('#scrollUp').click(function (e) {
			e.preventDefault();
			$('html,body').animate({ scrollTop:0});
		});
		$qrTools.hover(function () {
			qrImg.fadeIn();
		}, function(){
			 qrImg.fadeOut();
		});
});