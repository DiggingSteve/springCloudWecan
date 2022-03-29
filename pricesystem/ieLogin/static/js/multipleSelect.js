(function ($) {
  var IDcount = Math.round(Math.random()*10000)
  var inHideDelay = false

  function createUlGroup (data) {
    var ul = $('<ul class="dropdown_group"></ul>')
    ul.append($('<li class="group_title">' + data.label + '</li>'))
    for (var i = 0; i < data.options.length; i++) {
      ul.append($('<li class="dropdown_item" value="' + data.options[i].value + '">' + data.options[i].label + '</li>'))
    }
    return ul
  }

  function setInputContent (input, data) {
    var html = ''
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        html += '<p class="content_item">' + data[i] + '<i class="close"></i></p>'
      }
      input.html(html)
    } else {
      input.html('请选择系统').css('color', '#c0c4cc')
    }

    input.find('.close').click(function (event) {
      var $this = $(this)
      var content_item = $this.parent()
      var text = content_item.text()
      var select = content_item.parent().parent()
      content_item.remove()

      select.find('.dropdown_item[value="' + text + '"]').removeClass('selected')
      var value = select.find('.selected').map(function () {
        return $(this).attr('value')
      }).get()
      select.trigger('change', [value])
    })
  }

  function createDropDown (data) {
    var dropdownList = $('<ul class="dropdown_list"></ul>')
    var selectAll = $('<li class="dropdown_item selectAll">全选</li>')
    
    dropdownList.append(selectAll)
    for (var i = 0; i < data.length; i++) {
      dropdownList.append(createUlGroup(data[i]))
    }
    
    var dropdown = $('<div class="dropdown" tabindex="1"></div>')
    .append(dropdownList)
    .blur(function (event) {
      $(this).hide()
      inHideDelay = true
      setTimeout(function () {
        inHideDelay = false
      }, 200)
    })
    .click(function (event) {
      var $target = $(event.target)
      if ($target.hasClass('group_title')) return
      var $this = $(this)
      var value = null

      if ($target.hasClass('selectAll')) {

        var el = $this.find('.dropdown_item').not('.selectAll')
        var isAllSelect = true
        el.each(function () {
          if (!$(this).hasClass('selected')) isAllSelect = false
        })

        if (!isAllSelect) {
          value = el.map(function () {
            var $this = $(this)
            $this.addClass('selected')
            return $this.attr('value')
          }).get()
        } else {
          value = []
          el.each(function () {
            $(this).removeClass('selected')
          })
        }
        
        $this.parent().trigger('change', [value])
      } else if ($target.hasClass('dropdown_item')) {

        $target.toggleClass('selected')
        value = $this.find('.selected').map(function () {
          return $(this).attr('value')
        }).get()

        $this.parent().trigger('change', [value])
      }

      setInputContent($this.prev(), value)

    })
    return dropdown
  }

  createDropDown.setMaxHeight = function (instance, el) {
    if (instance.hasMaxHeight) return
    var top = $(el).offset().top + 45
    var maxHeight = document.body.clientHeight - top - 10
    instance.css({
      maxHeight: maxHeight
    })
    instance.hasMaxHeight = true
  }
  
  $.multipleSelect = function (data) {
    var id = 'multipleSelect' + IDcount++
    var select = $('<div class="multipleSelect"></div>').attr('id', id)
    var dropdown = createDropDown(data).hide()
    // var dropdown = createDropDown(data)

    select.html(
      '<div class="input">请选择系统</div>'
    )

    select.append(dropdown)
    select.find('.input').on('click', function (event) {
      if ($(event.target).hasClass('close')) return
      if (inHideDelay) return
      createDropDown.setMaxHeight(dropdown, event.target)
      dropdown.toggle().focus()
    })

    return select
  }

})(jQuery)