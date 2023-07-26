//Copyright © 2022 Marc Schubert <schubert.mc.ai@gmail.com>

fieldsList = document.getElementById("fields");
fieldsList.addEventListener("keyup", e=> {
    if (e.which == 32) {
        whitespace_pressed(e);
    }
})


this.getTheWords = function (data) {
    stringified = JSON.stringify(data)
    words = JSON.parse(stringified);
}
this.getTheColors = function (data) {
    stringified = JSON.stringify(data)
    colors = JSON.parse(stringified);
}

word_list = words;
color_list = colors;

function whitespace_pressed(e) {
    console.log(e.which)
    edited = false;
    
    var element = document.activeElement;

word_list = words;
color_list = colors;
old_text = element.editable.innerHTML;
working_text = old_text;
if (working_text.endsWith("&nbsp;")) {
    working_text = working_text.slice(0, (working_text.length-6));
}else {
}

splitted_by_space=working_text.split(" ");
var separators = ['&nbsp;',' '];
splitted_by_space = working_text.split(new RegExp(separators.join('|'), 'g'));
last_word = splitted_by_space[splitted_by_space.length-1];
last_word_length = last_word.length;
whole_text_length = working_text.length;
part_one = working_text.slice(0, (whole_text_length-last_word_length));
part_two = working_text.slice((whole_text_length-last_word_length));
working_text = part_two;

for (let word_idx = 0; word_idx < word_list.length; word_idx++) {
    const curWord = word_list[word_idx];

    if (working_text.includes(curWord)) {
        //TODO - count occurances of stirng 
        split_by_word = working_text.split(curWord); 
        counts = split_by_word.length -1;
        word_len = curWord.length;
        cur_color = color_list[word_idx];

        next_word_fromidx=0;
        for (let curwo_idx = 0; curwo_idx < counts; curwo_idx++) {
            start_idx = working_text.lastIndexOf(curWord, next_word_fromidx);
            // check index before whether this is already colored
            index_before = start_idx -1;
            char_before = working_text.charAt(index_before);
            string_before = working_text.slice(0,start_idx)
                string_after = working_text.slice(start_idx+word_len);
                chars_before =working_text.slice(index_before-4, index_before+1);
                
            if ((char_before != " ") && (start_idx != 0) && (char_before != ";")&& (chars_before != "&nbs")) {
            }else {
                string_before = working_text.slice(0,start_idx)
                string_after = working_text.slice(start_idx+word_len);

                string_after_length = string_after.length;
                colored_word = "<font class=\"cos\" color=\"" + cur_color + "\">" + curWord + "</font>"  // modified colors 
                len_colored_word = colored_word.length;
                edited=true;
                working_text = string_before + colored_word +string_after;
                if (string_after_length == 0) {
                    //add only &nbsp if its the end 
    
                    working_text = working_text + "&nbsp";
                }
                
            }  
            
            next_word_fromidx=start_idx +len_colored_word ;
        }


        


    }else {
        //console.log(curWord, " is not included.");
    }

    
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

working_text = part_one + working_text;

if (edited == true) {
    element.editable.innerHTML = working_text;
    placeCaretAtEnd(element.editable);

}

 }

