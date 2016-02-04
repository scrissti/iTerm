var button,
    state = 0,
    temp,
    update;

//plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/
$('.btn-number').click(function(e){
    e.preventDefault();
    type      = $(this).attr('data-type');
    datafield=$(this).attr('data-field');
    boolUpdate=false;
    if (datafield=='progr'){
        var currentVal = parseFloat(progr.val());
        if (!isNaN(currentVal)) {
            if(type == 'minus') {
                if(currentVal > progr.attr('min'))
                    progr.val(currentVal - 0.5).change();
                if(parseInt(progr.val()) == progr.attr('min'))
                    $(this).attr('disabled', true);
            } else if(type == 'plus') {
                if(currentVal < progr.attr('max'))
                    progr.val(currentVal + 0.5).change();
                if(parseInt(progr.val()) == progr.attr('max'))
                    $(this).attr('disabled', true);
            }
            boolUpdate=true;
        } else {
            input.val(0);
        }
    }else if (datafield=='calibration'){
        var currentVal = parseFloat(calibr.val());

        if (!isNaN(currentVal)) {
            if(type == 'minus') {
                if(currentVal > calibr.attr('min'))
                    calibr.val((currentVal - 0.1).toFixed(1)).change();
                if(parseFloat(calibr.val()) == progr.attr('min'))
                    $(this).attr('disabled', true);
            } else if(type == 'plus') {
                if(currentVal < calibr.attr('max'))
                    calibr.val((currentVal + 0.1).toFixed(1)).change();
                if(parseFloat(calibr.val()) == calibr.attr('max'))
                    $(this).attr('disabled', true);
            }
            temp.html((parseFloat(t)+parseFloat(calibr.val())).toFixed(2) + "&#8451;");
            boolUpdate=true;
        } else {
            input.val(0);
        }
    }else if (datafield=='delta'){
      var currentVal = parseFloat(delta.val());

      if (!isNaN(currentVal)) {
          if(type == 'minus') {
              if(currentVal > delta.attr('min'))
                  delta.val((currentVal - 0.1).toFixed(1)).change();
              if(parseFloat(delta.val()) == progr.attr('min'))
                  $(this).attr('disabled', true);
          } else if(type == 'plus') {
              if(currentVal < delta.attr('max'))
                  delta.val((currentVal + 0.1).toFixed(1)).change();
              if(parseFloat(delta.val()) == delta.attr('max'))
                  $(this).attr('disabled', true);
          }
          boolUpdate=true;
      } else {
          input.val(0);
      }
  }
    if (boolUpdate){
        $.get("//" + document.location.host + "/postProgr?progr=" + progr.val()+"&calib="+calibr.val()+"&delta="+delta.val());
    }
});

$('.input-number').focusin(function(){
   $(this).data('oldValue', $(this).val());
});

$('.input-number').change(function() {
    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());
    name = $(this).attr('name');
    if(valueCurrent >= minValue)
        $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    else {
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue)
        $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
     else {
        alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }
});


function refreshData() {
    var key=document.URL.search('key');
    if (key>0)
        key=document.URL.substring(document.URL.search('key'));
    $.get("/comfort?json=1&"+key, function(data) {
	if (data) {
        t=data.temp;
	    temp.html(((parseFloat(data.temp)+parseFloat(data.calibration)).toFixed(2) || "Unkown") + "&#8451;");
        update.html(Math.floor((new Date()-new Date(data.update))/1000));
        //do not refresh programming value
	    //progr.val(data.progr);
	    if (parseInt(data.state)==1) {
		  $(".led").addClass("led-green")
		  $(".led").removeClass("led-red");
	    } else {
		  $(".led").addClass("led-red")
		  $(".led").removeClass("led-green");
	    }
	}
	setTimeout(refreshData, 1000 * 1);
    });

}

t=-1;
temp = $(".temp");
update = $(".update");
progr = $("input[name='progr']");
calibr = $("input[name='calibration']");
delta = $("input[name='delta']");

refreshData();
