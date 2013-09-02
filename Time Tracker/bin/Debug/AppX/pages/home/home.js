(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("btnStart").addEventListener("click", startTask, false);
            document.getElementById("addNew").addEventListener("click", categoryFlyout, false);
            document.getElementById("btnAdd").addEventListener("click", addCategory, false);
            document.getElementById("newCategory").addEventListener("change", enableBtnAdd, false);
        }
    });

    var cat = {}; //*** variable to store all category attributes

    // Command and Flyout functions.
    function categoryFlyout() {
        showFlyout(newCategoryFlyout, Category, "bottom");
    }

    function showFlyout(flyout, anchor, placement) {
        flyout.winControl.show(anchor, placement);
    }

    function addCategory() {
        var oOption = document.createElement("OPTION");
        oOption.text = document.getElementById("newCategory").value;
        oOption.value = oOption.text;
        oOption.selected = true;
        //oOption.style.backgroundColor = '#' + color.value;
        Category.add(oOption);
        document.getElementById("newCategoryFlyout").winControl.hide();
    }



    function enableBtnAdd() {
        if(newCategory.value=="")
            document.getElementById("btnAdd").disabled = true;
        else
            document.getElementById("btnAdd").disabled = false;
    }




    function startTask() {
        
        /*** task element div ***/
        var taskElm = document.createElement("div");
        taskElm.id = "taskElm";

        /*** current time tag ***/
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var sec = currentTime.getSeconds();
        var timeInmsec = currentTime.getTime();

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        var stime = hours + ":" + minutes + ":" + sec;
        var stimenode = document.createTextNode("Start time: "+stime);
        var startTime = document.createElement("p");
        startTime.appendChild(stimenode);

        /*** task description tag ***/
        var para = document.createElement("p");
        var text = document.getElementById("task").value;
        var textnode = document.createTextNode(text);
        para.appendChild(textnode);        
        
        /*** category label ***/
        var categoryLabel = document.createElement("p");
        var category = Category.options[Category.selectedIndex].value;
        var catnode = document.createTextNode(category);
        categoryLabel.appendChild(catnode);
        categoryLabel.className = "categoryLabel";

        /*** end button to finish the task tracking ***/
        var endBtn = document.createElement("input");
        endBtn.type = "button";
        endBtn.value = "End";
        endBtn.id = "btnEnd";
        endBtn.onclick = function (e) { endFunc(timeInmsec, category); };

        var line = document.createElement("hr");

        /*** appending task desc, current time and end button to task element div ***/
        taskElm.appendChild(categoryLabel);
        taskElm.appendChild(para);
        taskElm.appendChild(startTime);
        taskElm.appendChild(endBtn);
        taskElm.appendChild(line);

        var parent = document.getElementById("taskList");

        /*** appending task element to the task list div ***/
        parent.insertBefore(taskElm, parent.firstChild);

        document.getElementById("btnStart").disabled = true;
    }



    function endFunc(start, category) {
        //var stimefmt = new Windows.Globalization.DateTimeFormatting.DateTimeFormatter("shorttime");
        //var dateToFormat = new Date();
        //var stime = stimefmt.format(dateToFormat);       

        document.getElementById("btnStart").disabled = false;

        var endbutton = document.getElementById("btnEnd");
        var pNode = endbutton.parentNode;

        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var sec = currentTime.getSeconds();

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        var etime = hours + ":" + minutes + ":" + sec;
        var etimenode = document.createTextNode("End time: "+etime);
        var endTime = document.createElement("p");
        endTime.appendChild(etimenode);

        var diff = new Date();
        var ms = currentTime.getTime() - start;
        
        var ss = Math.floor(ms / 1000);
        var mm = Math.floor(ss / 60);
        ss = ss % 60;
        var hh = Math.floor(mm / 60);
        mm = mm % 60;

        if (hh < 10)
            hh = "0" + hh;

        if (mm < 10)
            mm = "0" + mm;

        if (ss < 10)
            ss = "0" + ss;

        var timediff = hh + ":" + mm + ":" + ss;
        var tdiffnode = document.createTextNode("Time spent: " + timediff);
        var tDiff = document.createElement("p");
        tDiff.appendChild(tdiffnode);

        pNode.insertBefore(endTime, endbutton);
        pNode.insertBefore(tDiff, endbutton);




        /*** adding categories to TIME BREAKDOWN ***/
        if (!(document.getElementById(category + "Label"))) {
            var catElm = document.createElement("table");
            catElm.id = "catElm";

            var tableRow = document.createElement("tr");

            var categoryLabel = document.createElement("td");
            var catnode = document.createTextNode(category);
            categoryLabel.appendChild(catnode);
            categoryLabel.className = "labels";
            categoryLabel.id = category + "Label";


            cat[category] = {};
            cat[category]["time"] = ms;

            var totalCatTime = document.createElement("td");
            var timenode = document.createTextNode(timediff);
            totalCatTime.appendChild(timenode);
            totalCatTime.className = "formattedTime";
            totalCatTime.id = category + "formattedTime";

            tableRow.appendChild(categoryLabel);
            tableRow.appendChild(totalCatTime);
            catElm.appendChild(tableRow);

            document.getElementById("categoryTime").appendChild(catElm);

        }
        else if (cat[category]["time"]) {
            var oldms = cat[category]["time"];
            cat[category]["time"] = oldms + ms;
            
            var newS = Math.floor((ms + oldms) / 1000);
            var newM = Math.floor(newS / 60);
            newS = newS % 60;
            var newH = Math.floor(newM / 60);
            newM = newM % 60;

            if (newH < 10)
                newH = "0" + newH;

            if (newM < 10)
                newM = "0" + newM;

            if (newS < 10)
                newS = "0" + newS;

            var newTotalTime = newH + ":" + newM + ":" + newS;
            document.getElementById(category + "formattedTime").innerHTML = newTotalTime;
        }
       
        pNode.removeChild(endbutton);
    }
})();
