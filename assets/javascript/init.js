$( document ).ready(function() {

    $('.modal').modal();

    $('#modalTrigger').on('click', function() {
        $('#modal1').modal('open');
    });

     $('#modalTrigger2').on('click', function() {
        $('#modal2').modal('open');
    });

     $('#modalTrigger3').on('click', function() {
        $('#modal3').modal('open');
    }); 

     $('#modalTrigger4').on('click', function() {
        $('#modal4').modal('open');
    }); 

        var navListItems = $('div.setup-panel div a'),
            allWells = $('.setup-content'),
            allNextBtn = $('.nextBtn');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
                $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

    allNextBtn.click(function(){
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            isValid = true;

        $(".form-group").removeClass("has-error");
        for(var i=0; i<curInputs.length; i++){
            if (!curInputs[i].validity.valid){
                isValid = false;
                $(curInputs[i]).closest(".form-group").addClass("has-error");
            }
        }

        if (isValid)
            nextStepWizard.removeAttr('disabled').trigger('click');
    });

    $('div.setup-panel div a.btn-primary').trigger('click');

    $('#submit-item-name').on('click', function() {
        $('#modal4').modal('close');
        console.log('its working');

    });
    
$('#submit-finish-btn').on('click', function() {
    $('#modal1').modal('close');
   
});
$('#signin-btn').on('click', function() {
    $('#modal3').modal('close');
   
});
$('#signup-btn').on('click', function() {
    $('#modal2').modal('close');
  
});

});