function parseHash() {
    var params = (window.location.hash.substr(1)).split("&");

    for (i = 0; i < params.length; i++) {
        var bits = params[i].split("=");
        localStorage.setItem(bits[0], bits[1]);
    }
    
    var keys = "from_eori from_iban from_swiftbic language currency".split();
    
    for (var j = 0; j < keys.length; j++) {
        var value = localStorage.getItem(keys[j]);
        if (value) {
            $("#from_" + keys[j] + " input").val(value);
        }
    }
    
}

function new_line(){

    var data = `<tr><td class="product"><input type="text" value="Item name"/></td>
            <td class="quantity"><input type="text" value="0"/></td>
            <td class="price"><input type="text" value="0.00" min="0" step="0.05"/></td>
            <td class="amount"><span class="value">0.00</span> <span class="currency">USD</span></td>
            <th class="delete translate"><input type="button" value="x" onclick="del(this)"></th>
            </tr>`;
    $("#list").append(data);

    $("#list .quantity input").on("keyup", recalc);
    $("#list .price input").on("keyup", recalc);
}

function del(btndel) {
    if (typeof(btndel) == "object") {
        $(btndel).closest("tr").remove();
    }
    recalc();
}

function recalc() {
    $rows = $("#list tr");
    //alert($rows.length);
    
    var subtotal = 0.0;
    for (var j = 0; j < $rows.length; j++) {
        if (j == 0) {
            continue; // Skip header
        }
        var quantity = $(".quantity input", $rows[j]).val();
        
        var price = parseFloat($(".price input", $rows[j]).val());
        var amount = quantity * price;
        $(".amount .value", $rows[j]).html(amount.toFixed(2));
        
        subtotal += amount;
    }
    $("#subtotal_value").html(subtotal.toFixed(2));


    var vat_percent = parseInt($("#vat_percent").val());
    var vat = vat_percent * subtotal / 100.0;
    var total = vat + subtotal;
    console.log("vat percent:", vat_percent, "vat:", vat, "total:", total);
    $("#vat_value").html(vat.toFixed(2));
    $("#amount_due").html(total.toFixed(2));
    
}

function lz(n) {
    if (n < 10) return "0" + n;
    return "" + n;
}

function onChangeFromVATIN() {
    var vat_number = $("#from_vatin input").val();
    
    var vat_visible = !(vat_number == "-" || vat_number == "");
    var vat_calculation_visiblity = vat_visible ? "visible" : "hidden";
    
    if (vat_visible) {
        console.info("Showing VAT");
        $("#from_vatin").removeClass("print-display-none");
        $("#vat_percent").val("10");
    } else {
        console.info("Hiding VAT");
        $("#from_vatin").addClass("print-display-none");
        $("#vat_percent").val("0");
    }

    
    recalc();
}

function hideEmptyFields() {
    var value = $(this).val();
        
    if (value == "-" || value == "") {
        $(this).addClass("print-display-none");
    } else {
        $(this).removeClass("print-display-none");
    }
}

$(document).ready(function(e) {
    parseHash();

    $("input.print-display-none").each(function() {
        if ($(this).val() != "") {
            $(this).removeClass("print-display-none");
            if (!$(this).attr("placeholder")) {
                $(this).attr("placeholder", $(this).val());
            }
        }
    })
        
    $("input.print-display-none").on("keyup", hideEmptyFields);

        
    $("#list .quantity input").on("keyup", recalc);
    $("#list .price input").on("keyup", recalc);

    $("#vat_percent").on("keyup", recalc);

    
    onChangeFromVATIN();


    var now = new Date();
    $("#invoice_number").val(1900+now.getYear() + lz(now.getMonth()+1) + lz(now.getDate()) + "001");
    $("#invoice_date").val(now.toLocaleDateString("et-EE"));
    
    
    $("#currency").on("blur", function(e) {
        console.log($(".currency").get());
        $(".currency").html($("#currency").val());
        

    });
});