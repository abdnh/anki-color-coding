//Copyright © 2022 Marc Schubert <schubert.mc.ai@gmail.com>

this.getTheWords = function (data) {
    stringified = JSON.stringify(data)
    console.log(stringified + "\n")
    words = JSON.parse(stringified);
}
// words is the relevant variable

this.getTheColors = function (data) {
    stringified = JSON.stringify(data)
    console.log(stringified + "\n")
    colors = JSON.parse(stringified);
}
// colors is the relevant

var element = document.activeElement;

word_list = words;
color_list = colors;
//get text
old_text = element.editable.innerHTML;
working_text = old_text;
for (let word_idx = 0; word_idx < word_list.length; word_idx++) {
    const curWord = word_list[word_idx];
    if (working_text.includes(curWord)) {
        // word is included
        //TODO - count occurances of stirng 
        split_by_word = working_text.split(curWord); 
        counts = split_by_word.length -1;
        word_len = curWord.length;
        cur_color = color_list[word_idx];
        string_after = working_text.slice(start_idx+word_len);
        next_word_fromidx=0;
        for (let curwo_idx = 0; curwo_idx < counts; curwo_idx++) {
            edited = false;
            start_idx = working_text.indexOf(curWord, next_word_fromidx);
            // check index before whether this is already colored
            index_before = start_idx -1;
            
            char_before = working_text.charAt(index_before);
            chars_before =working_text.slice(index_before-5, index_before);
            if ((char_before != " ") && (start_idx != 0) && (char_before != ";") && (chars_before != "&nbsp")) {
            }else {
                string_before = working_text.slice(0,start_idx)
                string_after = working_text.slice(start_idx+word_len);
                string_after_length = string_after.length;
        
                colored_word = "<font class=\"cos\" color=\"" + cur_color + "\">" + curWord + "</font>"  // modified colors 
                len_colored_word = colored_word.length;
                edited = true;
                working_text = string_before + colored_word +string_after;
                if (string_after_length == 0) {
                    //add only &nbsp if its the end 
    
                    working_text = working_text + "&nbsp";
                }
                
            }  
            if (edited == true) {
                next_word_fromidx=start_idx +len_colored_word ;
            } else {
                next_word_fromidx = start_idx + word_len;
            }
         }


        


    }else {
        //console.log(curWord, " is not included.");
    }

    
}


element.editable.innerHTML = working_text;


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

placeCaretAtEnd(element.editable);


