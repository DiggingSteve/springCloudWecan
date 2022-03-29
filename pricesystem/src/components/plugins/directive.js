export default (Vue) => {
  /**
   * use: v-enterfocus="callback"
   * description: 使注册指令的组件或元素内部的el-input组件可以通过按下键盘Enter键将焦点跳转到下一个el-input组件中
   *              当跳转到内部的最后一个el-input组件上时，继续按下Enter将会执行指令上注册的回调函数
   * template:
   *   <div v-enterfocus="callback">
   *     <el-input></el-input>
   *     <el-input></el-input>
   *   </div>
   * methods:
   *   callback () {
   *     //console.log("callback")
   *   }
   */
  Vue.directive('enterfocus', {
    inserted(el, binding, vnode) {
      let is_el_input_com = false
      if (el.className.indexOf('el-input') !== -1) {
        is_el_input_com = true
      }
      let component = vnode.componentInstance || null

      el.addEventListener('keydown', function (ev) {

        if (ev.code == 'Enter' || ev.code == 'NumpadEnter') {
          // debugger
          let index = null
          if (is_el_input_com) {
            for (let com in component.$parent.$children) {

              if (component.$parent.$children[com] === component) {
                index = Number(com)
              }
              if (index !== null && Number(com) > index && component.$parent.$children[com].$el.className.indexOf('el-input') !== -1) {
                component.$parent.$children[com].focus()
                break
              }
            }
          } else {
            let canFocus = false

            function Traversal(vnode, component) {
              if (vnode) {
                for (let node in vnode.children) {
                  if (!vnode.children[node]) continue

                  if (vnode.children[node].elm && vnode.children[node].elm.nodeType == 1) {
                    if (getComputedStyle(vnode.children[node].elm).display == 'none') continue
                  }

                  if (vnode.children[node].componentInstance && (vnode.children[node].elm.className.indexOf('el-input') !== -1 || vnode.children[node].elm.className.indexOf('el-select') !== -1)) {
                    if (canFocus) {
                      setTimeout(() => {
                        vnode.children[node].componentInstance.focus()
                      }, 0)
                      return true
                    }

                    if (vnode.children[node].elm.contains(document.activeElement)) {
                      canFocus = true
                      continue
                    }

                  } else if (vnode.children[node].tag && vnode.children[node].children) {
                    if (Traversal(vnode.children[node])) return true
                  } else if (vnode.children[node].componentInstance && vnode.children[node].componentInstance.$children.length > 0) {
                    if (Traversal(null, vnode.children[node].componentInstance)) return true
                  }
                }
              } else {
                for (let com in component.$children) {
                  let className = component.$children[com].$el.className
                  if (className) {
                    if (className.indexOf('el-input') !== -1 || className.indexOf('el-select') !== -1) {
                      if (canFocus) {
                        setTimeout(() => {
                          component.$children[com].focus()
                        }, 0)
                        return true
                      }

                      component.$children[com].$el.contains(document.activeElement) ? canFocus = true : ''

                    } else if (component.$children[com].$children.length > 0) {
                      if (Traversal(null, component.$children[com])) return true
                    }
                  }
                }
              }
              return false
            }

            canFocus = component ? Traversal(null, component) : Traversal(vnode)

            if (!canFocus) binding.value ? binding.value() : ''
          }
        }
      })
    }
  })

  /**
   * use: v-fixtop
   * description: 仅限el-dialog组件内部使用
   *              使注册指令的元素在el-dialog滚动时自动吸附在页面顶端
   * template:
   *   <el-dialog>
   *     <div style="height:50px;background:#ffff66;" v-fixtop></div>
   *     <div style="height:1000px;"></div>
   *   </el-dialog>
   */
  Vue.directive('fixtop', {
    inserted(el, binding, vnode) {
      function get_dialog_wrapper(el) {
        if (el === document.body || el === document || el === window || !el)
          return el || document
        if (el.offsetParent && el.offsetParent.className.indexOf('el-dialog__wrapper') !== -1)
          return el.offsetParent
        else if (el.parentNode)
          return get_dialog_wrapper(el.parentNode)
        else
          return get_dialog_wrapper(el.offsetParent)
      }

      let backup_el = document.createElement('div'),
        parent_el = vnode.elm.parentElement,
        clientWidth = vnode.elm.clientWidth + 'px',
        clientHeight = vnode.elm.clientHeight + 'px',
        backup_style = {
          top: vnode.elm.style.top,
          width: vnode.elm.style.width,
          height: vnode.elm.style.height,
          zIndex: vnode.elm.style.zIndex,
          position: vnode.elm.style.position,
          boxShadow: vnode.elm.style.boxShadow
        }

      backup_el.style.width = clientWidth
      backup_el.style.height = clientHeight

      vnode.elm.style.transition = 'all .6s'

      get_dialog_wrapper(vnode.elm).addEventListener('scroll', function (ev) {
        if (clientWidth !== vnode.elm.clientWidth + 'px' || clientHeight == '0px') {
          clientWidth = vnode.elm.clientWidth + 'px'
          clientHeight = vnode.elm.clientHeight + 'px'
          backup_el.style.width = clientWidth
          backup_el.style.height = clientHeight
        }
        if (clientHeight !== vnode.elm.clientHeight + 'px') {
          backup_el.style.height = vnode.elm.clientHeight + 'px'
        }
        if (vnode.elm.getBoundingClientRect().top < 60 && vnode.elm.style.position != 'fixed') {
          vnode.elm.style.top = '60px'
          vnode.elm.style.paddingTop = '10px'

          vnode.elm.style.width = clientWidth
          vnode.elm.style.height = clientHeight + 10
          vnode.elm.style.zIndex = '10000'
          vnode.elm.style.position = 'fixed'
          vnode.elm.style.boxShadow = '0 10px 20px -10px'

          vnode.elm.insertAdjacentElement('afterend', backup_el)
        } else if (backup_el.getBoundingClientRect().top >= 60 && vnode.elm.style.position == 'fixed') {
          vnode.elm.style.top = backup_style.top
          vnode.elm.style.width = backup_style.width
          vnode.elm.style.height = backup_style.height
          vnode.elm.style.zIndex = backup_style.zIndex
          vnode.elm.style.position = backup_style.position
          vnode.elm.style.boxShadow = backup_style.boxShadow

          parent_el.removeChild(backup_el)
        }
      })
    }
  })

  /**
   * use: v-verify="'integer'"
   * description: 仅限input元素 && el-input组件上使用
   *              限制输入只能为规定值
   * bindValue: integer || float
   * template:
   *   <input v-verify></input>
   *   <el-input v-verify></el-input>
   */
  Vue.directive('verify', {
    inserted(el, binding, vnode) {
      const bindValue = binding.value
      if (!bindValue) return

      const verify = {
        // 整形
        integer: {
          test(value) {
            let reg = /^[0-9]+$/
            return reg.test(value)
          },
          newValue(oldVal) {
            let newVal = Number.parseInt(oldVal)
            return isNaN(newVal) ? '' : newVal
          }
        },
        // 浮点
        float: {
          test(value) {
            let reg = /^[0-9.]+$/
            return reg.test(value) && !isNaN(Number(value))
          },
          newValue(oldVal) {
            let newVal = Number.parseFloat(oldVal)
            return isNaN(newVal) ? '' : newVal
          }
        },
        // 总运单号验证  格式：xxx-xxxxxxxx
        mawb: {
          test(value) {
            return false
            /*        if (value.includes('-')) {
                     if (value.length > 12) return false
                   } else if (value.length >= 11) {
                     return false
                   }
                   return true */
            // let index = value.indexOf('-')
            // if (index !== -1 && index == 3) {
            //   let numArr = value.split('-')
            //   if (!Number.isInteger(Number(numArr[0])) || !Number.isInteger(Number(numArr[1])) || numArr[1].length > 8) {
            //     return false
            //   }
            // } else {
            //   if (!Number.isInteger(Number(value))) {
            //     return false
            //   }
            //   if (value.length > 3) {
            //     return false
            //   }
            // }
            // return true
          },
          newValue(oldVal) {
            let val = oldVal
            if (!oldVal.includes('-') && oldVal.length >= 11) {
              val = oldVal.substr(0, 3) + '-' + oldVal.substr(3, 8)
            }
            if (oldVal.includes('-') && oldVal.length > 12) {
              val = oldVal.substr(0, 12)
            }

            if (val.replace('-', '').length == 11 && (val.replace('-', '').substr(3, 7) % 7 != val.substr(11, 1))) {
              layer.alert('运单格式不正确！');
            }

            return val
            // if (oldVal.indexOf('-') == 3) {
            //   let numArr = [oldVal.slice(0,3), oldVal.slice(4)]
            //   numArr[1] = numArr[1].slice(0, -1)
            //   return `${numArr[0]}-${numArr[1]}`
            // } else {
            //   if (oldVal.length <= 3) {
            //     return isNaN(Number.parseInt(oldVal)) ? '' : Number.parseInt(oldVal)
            //   } else if (oldVal.length >= 4) {
            //     if (oldVal.indexOf('-') !== -1) {
            //       let str = oldVal.split('-')
            //       str[0] = isNaN(Number(str[0])) ? str[0].slice(0,-1) : str[0]
            //       str[1] = isNaN(Number(str[1])) ? str[1].slice(0,-1) : str[1]
            //       return str[0] + str[1]
            //     } else {
            //       let str = oldVal.slice(3)
            //       if (isNaN(Number(str))) str = str.slice(0,-1)
            //       return oldVal.slice(0, 3) + '-' + str
            //     }
            //   }
            // }
          }
        }, //保留一位小数
        fixedOne: {
          test(value) {
            let reg = /^\d{0,8}\.{0,1}(\d{1,2})?$/
            //console.log(reg.test(value) && !isNaN(Number(value)))
            return reg.test(value) && !isNaN(Number(value))
          },
          newValue(oldVal) {
            let newVal = String(Number.parseFloat(oldVal))
            //console.log(String(Number.parseFloat(oldVal)))
            return isNaN(newVal) ? '' : newVal.slice(0, newVal.indexOf('.') >= 0 ? newVal.indexOf('.') + 2 : newVal.length)
          }
        },
        fixedTwo: {
          test(value) {
            let reg = /^\d{0,8}\.{0,1}(\d{1,2})?$/
            return reg.test(value) && !isNaN(Number(value))
          },
          newValue(oldVal) {
            let newVal = String(Number.parseFloat(oldVal))
            return isNaN(newVal) ? '' : newVal.slice(0, newVal.indexOf('.') >= 0 ? newVal.indexOf('.') + 3 : newVal.length)
          }
        },
        fixedFTwo: {
          test(value) {
            let reg = /^(\-)?\d{0,8}\.{0,1}(\d{1,2})?$/
            return reg.test(value)
          },
          newValue(oldVal) {
            let newVal = String(Number.parseFloat(oldVal))
            return isNaN(newVal) ? '' : newVal.slice(0, newVal.indexOf('.') >= 0 ? newVal.indexOf('.') + 3 : newVal.length)
          }
        },
        fixedThree: {
          test(value) {
            let reg = /^\d{0,8}\.{0,1}(\d{1,2})?$/
            return reg.test(value) && !isNaN(Number(value))
          },
          newValue(oldVal) {
            let newVal = String(Number.parseFloat(oldVal))
            return isNaN(newVal) ? '' : newVal.slice(0, newVal.indexOf('.') >= 0 ? newVal.indexOf('.') + 4 : newVal.length)
          }
        },
        uppercase: { //只能输入大写
          test(value) {
            let reg = /[^A-Z]/
            return !reg.test(value)
          },
          newValue(oldVal) {
            return oldVal.toUpperCase()
          }
        },
        creditCode: { //信用代码，不能输入特殊符号
          test(value) {
            let reg = /[@:：.'`~,，。、\\\\\/;\[\]#\%\^&*()\!\$\-_\?\>\<=\|"}{]/;
            return !reg.test(value)
          },
          newValue(oldVal) {
            return oldVal.replace(/[@:：.'`~,，。、\\\\\/;\[\]#\%\^&*\(\)\!\$\-_\?\>\<=\|"}{]/g, '')
          }
        },
        phone: { //只能输入数字与空格
          test(value) {
            let reg = /[^0-9 ]/
            return !reg.test(value)
          },
          newValue(oldVal) {
            return oldVal.replace(/[^0-9 ]/g, '')
          }
        },
        noEngLetter: { //不能输入英文字母
          test(value) {
            let reg = /[A-Za-z@:：.]/
            return !reg.test(value)
          },
          newValue(oldVal) {
            return oldVal.replace(/[A-Za-z@:：.]/g, '')
          }
        },
        ams: {
          test(value) {

            // let reg = /[^\w ]/g
            let reg = /[^A-Za-z0-9]/g
            return !reg.test(value) && !(/[^A-Z]/.test(value))
          },
          newValue(oldVal) {
            // layer.msg('只能输入字母，数字，空格');
            return oldVal.toUpperCase().replace(/[^\w]/g, '')
          }
        },
        english: { //只能英文和空格
          test(value) {
            // let reg = /[^\w ]/g
            let reg = /[^A-Z ]/g
            return !reg.test(value)
          },
          newValue(oldVal) {
            return oldVal.toUpperCase().replace(/[^A-Z ]/g, '')
          }
        },
        sfgmdg: {
          test(value) {
            // 大写字母匹配
            let reg = /^[A-Z]+$/g
            return reg.test(value) && value.length <= 3
          },
          newValue(oldVal) {
            return oldVal.toUpperCase().slice(0, 3)
          }
        }
      }

      // let val = vnode.data.model && vnode.data.model.value
      // if (val && binding.value) {
      //   if (!verify[binding.value].test(val)) {
      //     let newVal = verify[binding.value].newValue(val)
      //     vnode.componentInstance.$emit('input', newVal)
      //   }
      // }

      let isComponent = false
      if (vnode.componentInstance) isComponent = true

      function getInput(el) {
        if (el.nodeName == 'INPUT') {
          return el
        } else if (el.nodeName == 'DIV' && el.classList.contains('el-input')) {
          return el.querySelector('input')
        } else if (el.classList.contains('el-textarea')) {
          return el.querySelector('textarea')
        }
      }
      // 获取光标位置
      function getSelectPosition(input) {
        let pos

        if (input.selectionStart == input.selectionEnd) {

          if (bindValue == 'mawb') {
            pos = input.selectionStart + 1
          } else {
            pos = input.selectionStart
          }
        } else {
          pos = -1
        }
        return pos
      }

      getInput(el).addEventListener('input', function (event) {
        let value = event.target.value
        if (!value || value == '') return

        if (!verify[bindValue].test(value)) {

          let pos = getSelectPosition(event.target)
          let newVal = verify[bindValue].newValue(value)

          if (bindValue == 'mawb' && value.length == 4) pos++

          if (isComponent) {
            Vue.nextTick(() => {
              vnode.componentInstance.$emit('input', newVal)

              setTimeout(() => {
                event.target.setSelectionRange(pos, pos)
              }, 0)
            })

          } else {
            Vue.nextTick(() => {
              let vModel = vnode.data.directives.filter(i => i.rawName == 'v-model')[0]

              if (vModel) {
                new Function(`this.context.${vModel.expression} = ${newVal}`).call(vnode)
              } else {
                event.target.value = newVal
              }

              setTimeout(() => {
                event.target.setSelectionRange(pos, pos)
              }, 0)
            })
          }
        }

      })
    }

  })

  // 返回顶部
  Vue.directive('scrollshow', {

    inserted(el, binding, vnode) {
      //debugger;
      ////console.log(el)
      ////console.log($('.dialogPage').length)
      //debugger;
      function get_dialog_wrapper(el) {
        if (el === document.body || el === document || el === window || !el)
          return el || document
        if (el.offsetParent && el.offsetParent.className.indexOf('el-dialog__wrapper') !== -1)
          return el.offsetParent
        else if (el.parentNode)
          return get_dialog_wrapper(el.parentNode)
        else
          return get_dialog_wrapper(el.offsetParent)
      }

      vnode.elm.style.transition = 'all .8s'

      //debugger
      //console.log(get_dialog_wrapper(vnode.elm).clientWidth)
      //(Number(document.documentElement.clientWidth) - Number(get_dialog_wrapper(vnode.elm).clientWidth)) / 2 + Number(get_dialog_wrapper(vnode.elm).clientWidth) - 20 + 'px'

      el.parentNode.parentNode.style.right = (Number(document.documentElement.clientWidth) - Number(get_dialog_wrapper(vnode.elm).clientWidth)) / 2 - 41 + 'px'
      //Number(Number(get_dialog_wrapper(vnode.elm).clientWidth)+Number(get_dialog_wrapper(vnode.elm).parentNode.offsetParent.offsetLeft))-52+'px'
      let scope = binding.arg || '200'
      ////console.log(1,binding.arg)
      ////console.log(get_dialog_wrapper(vnode.elm))

      get_dialog_wrapper(vnode.elm).addEventListener("scroll", function (e) {
        ////console.log(binding.arg)
        //debugger;
        if (this.scrollTop > Number(binding.arg)) {
          //debugger

          binding.value.value = true
          // setTimeout(function(){
          //   binding.value.value=false
          // },1600)
        } else {
          binding.value.value = false
        }
      })

    }
  })

  Vue.directive('backtop', {
    inserted(el, binding, vnode) {

      function get_dialog_wrapper(el) {
        if (el === document.body || el === document || el === window || !el)
          return el || document
        if (el.offsetParent && el.offsetParent.className.indexOf('el-dialog__wrapper') !== -1)
          return el.offsetParent
        else if (el.parentNode)
          return get_dialog_wrapper(el.parentNode)
        else
          return get_dialog_wrapper(el.offsetParent)
      }
      vnode.elm.style.transition = 'all .6s'
      //console.log(el)
      //let e = binding.arg || 'click'
      el.addEventListener('click', function () {
        //this.scrollTop = 0;
        //alert('1')
        let timer = setInterval(() => {
          //   //console.log(1)
          get_dialog_wrapper(vnode.elm).scrollTop = get_dialog_wrapper(vnode.elm).scrollTop - 50;
          if (get_dialog_wrapper(vnode.elm).scrollTop == 0) {
            clearInterval(timer)
          }


        }, 10)
      })
    }
  })


  Vue.directive('visible', {
    componentUpdated: function (el, binding, vnode) {
      el.style.visibility = binding.value ? 'visible' : 'hidden'
    }
  })
  Vue.directive('hide', {
    componentUpdated: function (el, binding, vnode) {
      el.style.display = binding.value ? 'none' : ''
    }
  })

  Vue.directive('mydrag', {
    inserted: function (el, binding, vnode) { //注意，目前这个指令绑定的是id
      let ev = el; //获取当前元素
      // console.log(el)
      // console.log(binding)
      // console.log(ev)
      el.ondragstart = ev => {
        ev.dataTransfer.setData(
          "Text",
          ev.target.id
        );
      };
      el.ondragover = ev => {
        ev.preventDefault();
      };
      el.ondrop = ev => {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("Text");
        binding.value(ev, data);
      };
    }


  })

  Vue.directive("focus", {
    inserted: function (el) {
        el.focus();
    }
  })

  Vue.directive("nofocus", {
   
    inserted:function(el){
      
      el.addEventListener("focus",()=>{
        el.blur();
      })
    }
  })

  Vue.directive("focusSelect",{
    inserted:function(el){
      el.onfocus=(e)=>{
        e.currentTarget.select();
      }
    }
  })

}
