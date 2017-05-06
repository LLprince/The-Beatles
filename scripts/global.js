function addLoadEvent(func) {
   var oldonload = window.onload;
   //  如果在这个处理函数上还没有绑定任何函数，就像平时那样把新函数添加给它。
   //  如果在这个处理函数上已经绑定了一些函数，就把新函数追加到现在指令的末尾。
   if (typeof window.onload != 'function') {
      window.onload = func;
   } else {
      window.onload = function() {
         oldonload();
         func();
      }
   }
}
//DOM只有insertBefore方法，没有insertAfter方法，所以只能自己写一个。
//在targetElement元素后面插入newElememt元素。
function insertAfter(newElememt, targetElement) {
   var parent = targetElement.parentNode;
   if (parent.lastChild == targetElement) {
      parent.appendChild(newElememt);
   } else {
      parent.insertBefore(newElememt, targetElement.nextSibling);
   }
}

// 为元素追加calss属性（而不是替换）
function addClass(element, value) {
   // 判断elment的属性是否为null
   if (!element.className) {
      element.className = value;
   } else {
      newClassName = element.className;
      newClassName += " ";
      newClassName += value;
      element.className = newClassName;
   }
}

// 当前页面链接块突出显示
function highlightPage() {
   if (!document.getElementsByTagName) return false;
   var headers = document.getElementsByTagName('header');
   if (headers.length === 0) return false;
   var navs = headers[0].getElementsByTagName('nav');
   if (navs.length === 0) return false;
   var links = navs[0].getElementsByTagName('a');
   for (var i = 0; i < links.length; i++) {
      var linkurl = links[i].getAttribute("href");
      if (window.location.href.indexOf(linkurl) != -1) {
         links[i].className = "here";
         var linkText = links[i].lastChild.nodeValue.toLowerCase();
         document.body.setAttribute("id", linkText);
      }
   }
}
addLoadEvent(highlightPage);

// 幻灯片滚动
function moveElement(elementID, final_x, final_y, interval) {
   if (!document.getElementById) return false;
   if (!document.getElementById(elementID)) return false;
   var elem = document.getElementById(elementID);
   if (elem.movement) {
      clearTimeout(elem.movement);
   }
   //  第一次进来时先将left和top赋值为0
   if (!elem.style.left) {
      elem.style.left = "0px";
   }
   if (!elem.style.top) {
      elem.style.top = "0px";
   }
   var xpos = parseInt(elem.style.left);
   var ypos = parseInt(elem.style.top);
   var dist;
   if (xpos == final_x && ypos == final_y) {
      return true;
   }
   if (xpos < final_x) {
      dist = Math.ceil((final_x - xpos) / 10);
      xpos = xpos + dist;
   }
   if (xpos > final_x) {
      dist = Math.ceil((xpos - final_x) / 10);
      xpos = xpos - dist;
   }
   if (ypos < final_y) {
      dist = Math.ceil((final_y - ypos) / 10);
      ypos = ypos + dist;
   }
   if (ypos > final_y) {
      dist = Math.ceil((ypos - final_y) / 10);
      ypos = ypos - dist;
   }
   elem.style.left = xpos + "px";
   elem.style.top = ypos + "px";
   var repeat = "moveElement('" + elementID + "'," + final_x + "," + final_y + "," + interval + ")";
   elem.movement = setTimeout(repeat, interval);
}

function prepareSlideshow() {
   if (!document.getElementsByTagName) return false;
   if (!document.getElementById) return false;
   if (!document.getElementById("intro")) return false;
   var intro = document.getElementById("intro");
   var slideshow = document.createElement("div");
   slideshow.setAttribute("id", "slideshow");
   var frame = document.createElement("img");
   frame.setAttribute("src", "images/frame.gif");
   frame.setAttribute("alt", "");
   frame.setAttribute("id", "frame");
   slideshow.appendChild(frame);
   var preview = document.createElement("img");
   preview.setAttribute("src", "images/slideshow.gif");
   preview.setAttribute("alt", "photos");
   preview.setAttribute("id", "preview");
   slideshow.appendChild(preview);
   insertAfter(slideshow, intro);
   var links = document.getElementsByTagName("a");
   var destination;
   for (var i = 0; i < links.length; i++) {
      links[i].onmouseover = function() {
         destination = this.getAttribute("href");
         if (destination.indexOf("index.html") != -1) {
            moveElement("preview", 0, 0, 5);
         }
         if (destination.indexOf("about.html") != -1) {
            moveElement("preview", -150, 0, 5);
         }
         if (destination.indexOf("photos.html") != -1) {
            moveElement("preview", -300, 0, 5);
         }
         if (destination.indexOf("live.html") != -1) {
            moveElement("preview", -450, 0, 5);
         }
         if (destination.indexOf("contact.html") != -1) {
            moveElement("preview", -600, 0, 5);
         }
      };
   }
}
addLoadEvent(prepareSlideshow);

// 显示指定id的<section>,隐藏其他<section>
function showSection(id) {
   var sections = document.getElementsByTagName("section");
   for (var i = 0; i < sections.length; i++) {
      if (sections[i].getAttribute("id") != id) {
         sections[i].style.display = "none";
      } else {
         sections[i].style.display = "block";
      }
   }
}

function prepareInternalnav() {
   if (!document.getElementById) return false;
   if (!document.getElementsByTagName) return false;
   var articles = document.getElementsByTagName("article");
   if (articles.length === 0) return false;
   var navs = articles[0].getElementsByTagName("nav");
   if (navs.length === 0) return false;
   var nav = navs[0];
   var links = nav.getElementsByTagName("a");
   for (var i = 0; i < links.length; i++) {
      var sectionId = links[i].getAttribute("href").split("#")[1];
      if (!document.getElementById(sectionId)) continue;
      document.getElementById(sectionId).style.display = "none";
      links[i].destination = sectionId;
      links[i].onclick = function() {
         showSection(this.destination);
         return false;
      };
   }
}
addLoadEvent(prepareInternalnav);

// photos.html页面
function showPic(whichpic) {
   if (!document.getElementById("placeholder")) return false;
   var source = whichpic.getAttribute("href");
   var placeholder = document.getElementById("placeholder");
   var text;
   placeholder.setAttribute("src", source);
   if (whichpic.getAttribute("title")) {
      text = whichpic.getAttribute("title");
   } else {
      text = "";
   }
   var description = document.getElementById("description");
   // 通过nodeType === 3判断是否是文本节点
   if (description.firstChild.nodeType === 3) {
      description.firstChild.nodeValue = text;
   }
   return false;
}

function preparePlaceholder() {
   if (!document.createElement) return false;
   if (!document.createTextNode) return false;
   if (!document.getElementById) return false;
   if (!document.getElementById("imagegallery")) return false;
   var placeholder = document.createElement("img");
   placeholder.setAttribute("id", "placeholder");
   placeholder.setAttribute("src", "images/placeholder.gif");
   placeholder.setAttribute("alt", "my image gallery");
   var description = document.createElement("p");
   description.setAttribute("id", "description");
   // createTextNode() 创建文本节点
   var desctext = document.createTextNode("Choose an image");
   description.appendChild(desctext);
   var gallery = document.getElementById("imagegallery");
   insertAfter(description, gallery);
   insertAfter(placeholder, description);
}

function prepareGallery() {
   if (!document.getElementsByTagName) return false;
   if (!document.getElementById) return false;
   if (!document.getElementById("imagegallery")) return false;
   var gallery = document.getElementById("imagegallery");
   var links = gallery.getElementsByTagName("a");
   for (var i = 0; i < links.length; i++) {
      links[i].onclick = function() {
         // 这里传过去的是元素节点
         return showPic(this);
      };
   }
}
addLoadEvent(preparePlaceholder);
addLoadEvent(prepareGallery);

function stripeTables() {
   if (!document.getElementsByTagName) return false;
   var tables = document.getElementsByTagName("table");
   for (var i = 0; i < tables.length; i++) {
      var odd = false;
      var rows = tables[i].getElementsByTagName("tr");
      for (var j = 0; j < rows.length; j++) {
         if (odd === true) {
            addClass(rows[j], "odd");
            odd = false;
         } else {
            odd = true;
         }
      }
   }
}

function highlightRows() {
   if (!document.getElementsByTagName) return false;
   var rows = document.getElementsByTagName("tr");
   for (var i = 1; i < rows.length; i++) {
      rows[i].oldClassName = rows[i].className;
      rows[i].onmouseover = function() {
         // 要用this,不能用rows[i].
         addClass(this, "highlight");
      };
      // 要用this,不能用rows[i].
      rows[i].onmouseout = function() {
         this.className = this.oldClassName;
      };
   }
}

function displayAbbreviations() {
   if (!document.getElementsByTagName || !document.createElement || !document.createTextNode) return false;
   var abbreviations = document.getElementsByTagName("abbr");
   if (abbreviations.length < 1) return false;
   var definition;
   var key;
   var defs = new Array();
   for (var i = 0; i < abbreviations.length; i++) {
      var current_abbr = abbreviations[i];
      if (current_abbr.childNodes.length < 1) return false;
      definition = current_abbr.getAttribute("title");
      key = current_abbr.lastChild.nodeValue;
      defs[key] = definition;
   }

   var dlist = document.createElement("dl");
   for (key in defs) {
      var def = defs[key];
      var dtitle = document.createElement("dt");
      var dtitle_text = document.createTextNode(key);
      dtitle.appendChild(dtitle_text);
      var ddesc = document.createElement("dd");
      var ddesc_text = document.createTextNode(def);
      ddesc.appendChild(ddesc_text);
      dlist.appendChild(dtitle);
      dlist.appendChild(ddesc);
   }
   if (dlist.childNodes.length < 1) return false;
   var header = document.createElement("h3");
   var header_text = document.createTextNode("Abbreviations");
   header.appendChild(header_text);
   var articles = document.getElementsByTagName("article");
   if (articles.length === 0) return false;
   var container = articles[0];
   container.appendChild(header);
   container.appendChild(dlist);
}

addLoadEvent(stripeTables);
addLoadEvent(highlightRows);
addLoadEvent(displayAbbreviations);


// contact.html页面 当浏览器不支持lable的for属性时，通过这个函数也可以实现点击lable,对应的表单空间获得焦点。
function focusLables() {
   if (!document.getElementsByTagName) return false;
   var lables = document.getElementsByTagName("label");
   for (var i = 0; i < lables.length; i++) {
      if (!lables[i].getAttribute("for")) continue;
      lables[i].onclick = function() {
         var id = this.getAttribute("for");
         if (!document.getElementById(id)) return false;
         var element = document.getElementById(id);
         element.focus();
      };
   }
}
addLoadEvent(focusLables);

function resetFields(whichform) {
   if (Modernizr.input.placeholder) return;
   for (var i = 0; i < whichform.elements.length; i++) {
      var element = whichform.elements[i];
      if (element.type === "submit") continue;
      var check = element.placeholder;
      if (!check) continue;
      element.onfocus = function() {
         var text = this.placeholder;
         if (this.value === text) {
            this.className = "";
            this.value = "";
         }
      };
      element.onblur = function() {
         if (this.value === "") {
            this.className = 'placeholder';
            this.value = this.placeholder;
         }
      };
      element.onblur();
   }
}

function prepareForms() {
   for (var i = 0; i < document.forms.length; i++) {
      var thisform = document.forms[i];
      resetFields(thisform);
      thisform.onsubmit = function() {
        if(!validateForm(this)) return false;
        var article = document.getElementsByTagName("article")[0];
        if (submitFormWithAjax(this,article)) return false;
        return true;
      };
   }
}
addLoadEvent(prepareForms);

function validateForm(whichform) {
   for (var i = 0; i < whichform.elements.length; i++) {
      var element = whichform.elements[i];
      if (element.required == true) {
         if (!isFilled(element)) {
            alert("Please fill in the " + element.name + " field.");
            return false;
         }
      }
      //alert(element.type);
      if (element.name == "email") {
         if (!isEmail(element)) {
            alert("The " + element.name + " filed must be a valid email address.");
            return false;
         }
      }
   }
   return true;
}
//验证必填控件内内容是否为空或占位符
function isFilled(field) {
   if (field.value.replace(" ", "").length === 0) return false;
   var placeholder = field.placeholder;
   return (field.value != placeholder);
}
//验证邮件控件内的格式是否正确
function isEmail(field) {
   return (field.value.indexOf("@") != -1 && field.value.indexOf(".") != -1);
}

function getHTTPObject() {
  if(typeof XMLHttpRequest == "undefined") {
    XMLHttpRequest =  function () {
      try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
      } catch (e) {}
      try {
        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
      } catch (e) {}
      try {
        return new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {}
    };
    return false;
  }
  return new XMLHttpRequest();
}

function displayAjaxLoading(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
  var content = document.createElement("img");
  content.setAttribute("src","images/loading.gif");
  content.setAttribute("alt","Loading...");
  element.appendChild(content);
}

function submitFormWithAjax(whichform,thetarget) {
  var request = getHTTPObject();
  if(!request) {return false;}
  displayAjaxLoading(thetarget);
  var dataParts = [];
  var element;
  for (var i = 0; i < whichform.elements.length; i++) {
    element = whichform.elements[i];
    dataParts[i] = element.name + "=" + encodeURIComponent(element.value);
  }
  var data = dataParts.join("&");
  request.open("POST",whichform.getAttribute("action"),true);
  request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  request.onreadystatechange = function () {
    if(request.readyState == 4) {
      if(request.status == 200 || request.status == 0) {
        var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);
        if(request.status == 4) {
          thetarget.innerHTML = matches[1];
        } else {
          thetarget.innerHTML = "<p>There was a error.Sorry </p>";
        }
      } else {
        thetarget.innerHTML = "<p>" + request.statusText + "</p>";
      }
    }
  };
  request.send(data);
  return true;
}
