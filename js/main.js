const params = new URLSearchParams(window.location.search);
const code = params.get('invite');
var validatedInvite = false;

$(document).ready(function() {
  // ascunde toate câmpurile pentru copii la început
  $('.copil').hide();
  $('.persoana').hide();
	  $('#copii').hide();

  // la schimbarea selectului
  $('#nr_copii').on('change', function() {
    var nr = parseInt($(this).val());
    
    // ascunde toate câmpurile de copii
    $('.copil').hide();

    // afișează doar câte e nevoie
    for (var i = 1; i <= nr; i++) {
      $('#copil' + i).show();
    }
  });
  
  
  $('#nr_persoane').on('change', function() {
    var nr = parseInt($(this).val());
    
    // ascunde toate câmpurile de copii
    $('.persoana').hide();
	
	if (nr == 0) {
	  $('#copii').hide();
	  $('#nr_copii').val("0");
	  $('.copil').hide();
	}

    // afișează doar câte e nevoie
    for (var i = 1; i <= nr; i++) {
	  $('#copii').show();
      $('#persoana' + i).show();
    }
  });
});

jQuery(document).ready(function($){

	/* prepend menu icon */
	$('#nav-wrap').prepend('<div id="menu-icon">Menu</div>');
	
	/* toggle nav */
	$("#menu-icon").on("click", function(){
		$("#nav").slideToggle();
		$(this).toggleClass("active");
	});

});

	// --------------------------------------------------------------------------	
	// Subpage Slider -----------------------------------------------------------
	// --------------------------------------------------------------------------
    jQuery(document).ready(function ($) {

      //Stellar.js
      $(window).stellar();

      var links = $('.navigation').find('li');
      slide = $('.slide');
      button = $('.button');
      mywindow = $(window);
      htmlbody = $('html,body');

      function goToByScroll(dataslide) {
          htmlbody.animate({
              scrollTop: $('.slide[data-slide="' + dataslide + '"]').offset().top-60
          }, 1000, 'easeInOutQuint');
      }

      links.click(function (e) {
          e.preventDefault();
          dataslide = $(this).attr('data-slide');
          goToByScroll(dataslide);
      });

      button.click(function (e) {
          e.preventDefault();
          dataslide = $(this).attr('data-slide');
          goToByScroll(dataslide);

    });
	
	// --------------------------------------------------------------------------
	// prettyPhoto --------------------------------------------------------------
	// --------------------------------------------------------------------------	
	$("a.prettyPhoto").prettyPhoto({
		social_tools:'',
		deeplinking:false,
		theme: 'light_square'
	});
	
	jQuery("a[data-rel^='prettyPhoto']").prettyPhoto(); 

	// --------------------------------------------------------------------------	
	// tooltips -----------------------------------------------------------------
	// --------------------------------------------------------------------------
	$('.tip[title]').qtip({
		position:{
			my: 'bottom center',
			at: 'top center',
			adjust: {
				x: -1,
				y: -32
			}
		},
		style: {
			classes: 'ui-tooltip-tipsy ui-tooltip-shadow'
		}		
	});	

	// --------------------------------------------------------------------------	
	// Image hover effect -------------------------------------------------------
	// --------------------------------------------------------------------------	
    $(function() {
      // ON MOUSE OVER
      $(".photos img").hover(function () {
      // SET OPACITY TO 70%
      $(this).stop().animate({
      opacity: .7
      }, "slow");
    }, 
    // ON MOUSE OUT
    function () {
      // SET OPACITY BACK TO 50%
      $(this).stop().animate({
      opacity: 1
      }, "slow");
    });

});
	

	
});

document.addEventListener("DOMContentLoaded", async () => {
  if (!code) {
    console.error("Invitație invalidă.");
    return;
  }

  try {
    // Endpoint GET
	// console.log("https://wedding-invites.alwaysdata.net/api/invites/invite-detail/code=" + code + "/");
    const getResponse = await fetch("https://wedding-invites.alwaysdata.net/api/invites/invite-detail/code=" + code + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!getResponse.ok) {
      throw new Error("Eroare la cererea GET");
	  return;
    }
	else{
		validatedInvite = true;
	}

    const getData = await getResponse.json();
    console.log("Răspuns GET:", getData);
	
	var persoaneConfirmate = getData.confirmed_people?.length;
	ShowConfirmedText(persoaneConfirmate);
	
	// verificăm dacă există people și cel puțin un element
	const name1 = getData.people?.[0]?.given_name || null;
	var invitationName = name1;
	
	const fname1 = getData.people?.[0]?.family_name || null;
	document.getElementById("nume-pers-1").value = name1 + " " + fname1;
	
	if (getData.people?.length > 1) {
		const name2 = getData.people?.[1]?.given_name || null;
		invitationName = invitationName + " & " + name2;
		document.getElementById('invited_header').innerHTML = "Bună, " + invitationName + "! Ne-am bucura enorm să fiți alături de noi în ziua în care ne unim destinele.";
		
	const fname2 = getData.people?.[1]?.family_name || null;
	document.getElementById("nume-pers-2").value = name2 + " " + fname2;
	}
	else {
		document.getElementById('invited_header').innerHTML = "Bună, " + invitationName + "! Ne-am bucura enorm să fii alături de noi în ziua în care ne unim destinele.";
	}
	console.log("Nume invitatie:", invitationName);

    // Endpoint PATCH
    const patchResponse = await fetch("https://wedding-invites.alwaysdata.net/api/invites/update-date-last-access/code=" + code + "/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "accepted" // sau alt câmp relevant
      }),
    });

    if (!patchResponse.ok) {
      throw new Error("Eroare la cererea PATCH");
    }

    const patchData = await patchResponse.json();
    // console.log("Răspuns PATCH:", patchData);

  } catch (error) {
    console.error("Eroare:", error);
  }
  
  const button1 = document.getElementById("submit-button");

button1.addEventListener("click", async () => {
	try{
	// Pregătim payload-ul pentru POST
	
	if (!validatedInvite)
	{
		alert("Număr de invitație invalid.");
		return;
	}
	
	var isComing = $('#nr_persoane').val() > 0;
	var message = document.getElementById("message").value;
	
	var nrPers = document.getElementById("nr_persoane").value;
	var nrCopii = document.getElementById("nr_copii").value;
	
	var confirmedPeople = [];
	
	for (var i = 1; i <= nrPers; i++){
		if (document.getElementById("nume-pers-" + i).value.trim() == "")
		{
			alert("Nu ați completat un nume.");
			return;
		}
		if (document.getElementById("meniu-pers-" + i).value.trim() == "")
		{
			document.getElementById("meniu-pers-" + i).value = 1;
		}
		confirmedPeople.push({
			full_name: document.getElementById("nume-pers-" + i).value,
			menu_type_id: document.getElementById("meniu-pers-" + i).value
		});
	}
	for (var i = 1; i <= nrCopii; i++){
		if (document.getElementById("nume-copil-" + i).value.trim() == "")
		{
			alert("Nu ați completat un nume.");
			return;
		}
		if (document.getElementById("meniu-copil-" + i).value.trim() == "")
		{
			document.getElementById("meniu-copil-" + i).value = 1;
		}
		confirmedPeople.push({
			full_name: document.getElementById("nume-copil-" + i).value,
			menu_type_id: document.getElementById("meniu-copil-" + i).value
		});
	}
	
    const postData = {
      code: code,
      is_coming: isComing,
      message: message,
      confirmed_people: confirmedPeople
    };
	
	console.log(JSON.stringify(postData));

    // POST request
    const postResponse = await fetch("https://wedding-invites.alwaysdata.net/api/invites/responses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData)
    });

    if (!postResponse.ok) throw new Error("Eroare la POST");

    const postResult = await postResponse.json();
    console.log("Răspuns POST:", postResult);

  } catch (error) {
    console.error("A apărut o eroare:", error);
  }
  ShowConfirmedText(confirmedPeople.length);
  alert("Raspunsul a fost inregistrat. Multumim!");
});
});

function ShowConfirmedText(nrPers){
	const t = document.getElementById("confirmat");
	
	if (nrPers == 0)
	{
		t.style.display = "none";
		return;
	}
	
	t.innerHTML = "Ați confirmat pentru " + nrPers + " persoane. Vă așteptăm!";
	t.style.display = "block";
}


