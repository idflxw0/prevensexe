$(function () {
    $('a[href*=\\#]:not([href=\\#])').on('click', function () {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.substr(1) + ']');
        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    });
});

$(function () {
    var target = $('.bottom-content');
    if (target.length) {
        $('html,body').animate({
            scrollTop: target.offset().top
        }, 1000);
        return false;
    }
});
