import { authService } from '../../services';
// import jwt_decode from 'jwt-decode';
import { localStorageAuth } from '../../../../settings'


export const NAVIGATION_INIT = 'NAVIGATION_INIT';

export function navigationInit(item) {
  return dispatch => {
    try {
      let UserAuth = JSON.parse(localStorage.getItem(localStorageAuth));
      const initialState = UserAuth ? UserAuth.id : {};

      authService.loadMenuByUserid(initialState).then(
        Menu => {

          let modules = Menu.map(a => a.MODULE);
          // let unique = [...new Set(modules)]
          var unique = modules.filter((v, i, a) => a.indexOf(v) === i);
          for (let i in unique) {
            Menu.push({ SCREEN_ID: unique[i], MODULE: unique[i], SCREEN_NAME: unique[i] })
          }
          Menu.push({ SCREEN_ID: "Home", MODULE: "Home", SCREEN_NAME: "Home" })
          Menu.push({ SCREEN_ID: "Report", MODULE: "Report", SCREEN_NAME: "Report" })

          const items = item.items.map(addId)

          let objectitem = []
          for (let item in items) {
            for (let menu in Menu) {

              let tempitem
              if (items[item].screen_id == Menu[menu].SCREEN_ID) {
                //  tempitem = {
                //   title: Menu[menu].SCREEN_NAME,
                //   route: items[item].route,
                //   comment: Menu[menu].SCREEN_NAME,
                //   screen_id: items[item].screen_id,
                //   icon: items[item].icon,
                //   items: []
                // }

                tempitem = {}
                tempitem['title'] = Menu[menu].SCREEN_NAME
                if (items[item].route !== undefined) tempitem['route'] = items[item].route
                tempitem['comment'] = Menu[menu].SCREEN_NAME
                if (items[item].screen_id !== undefined) tempitem['screen_id'] = items[item].screen_id
                if (items[item].icon !== undefined) tempitem['icon'] = items[item].icon
                if (items[item].items !== undefined) tempitem['items'] = []
                if (items[item]._id !== undefined) tempitem['_id'] = items[item]._id

                if (items[item].items !== undefined) {
                  for (let item2 in items[item].items) {
                    for (let menu2 in Menu) {
                      let tempitem2
                      if (items[item].items[item2].screen_id == Menu[menu2].SCREEN_ID) {

                        // tempitem2 = {
                        //   title: Menu[menu2].SCREEN_NAME,
                        //   route: items[item].items[item2].route,
                        //   comment: Menu[menu2].SCREEN_NAME,
                        //   screen_id: items[item].items[item2].screen_id,
                        //   icon: items[item].items[item2].icon,
                        //   items: []
                        // }
                        tempitem2 = {}
                        tempitem2['title'] = Menu[menu2].SCREEN_NAME
                        if (items[item].items[item2].route !== undefined) tempitem2['route'] = items[item].items[item2].route
                        tempitem2['comment'] = Menu[menu2].SCREEN_NAME
                        if (items[item].items[item2].screen_id !== undefined) tempitem2['screen_id'] = items[item].items[item2].screen_id
                        if (items[item].items[item2].icon !== undefined) tempitem2['icon'] = items[item].items[item2].icon
                        if (items[item].items[item2].items !== undefined) tempitem2['items'] = []
                        if (items[item].items[item2]._id !== undefined) tempitem2['_id'] = items[item].items[item2]._id

                        if (items[item].items[item2].items !== undefined) {
                          for (let item3 in items[item].items[item2].items) {
                            for (let menu3 in Menu) {
                              let tempitem3
                              if (items[item].items[item2].items[item3].screen_id == Menu[menu3].SCREEN_ID) {
                                // tempitem3 = {
                                //   title: Menu[menu3].SCREEN_NAME,
                                //   route: items[item].items[item2].items[item3].route,
                                //   comment: Menu[menu3].SCREEN_NAME,
                                //   screen_id: items[item].items[item2].items[item3].screen_id,
                                //   icon: items[item].items[item2].items[item3].icon,
                                //   items: []
                                // }

                                tempitem3 = {}
                                tempitem3['title'] = Menu[menu3].SCREEN_NAME
                                if (items[item].items[item2].items[item3].route !== undefined) tempitem3['route'] = items[item].items[item2].items[item3].route
                                tempitem3['comment'] = Menu[menu3].SCREEN_NAME
                                if (items[item].items[item2].items[item3].screen_id !== undefined) tempitem3['screen_id'] = items[item].items[item2].items[item3].screen_id
                                if (items[item].items[item2].items[item3].icon !== undefined) tempitem3['icon'] = items[item].items[item2].items[item3].icon
                                if (items[item].items[item2].items[item3].items !== undefined) tempitem3['items'] = []
                                if (items[item].items[item2].items[item3]._id !== undefined) tempitem3['_id'] = items[item].items[item2].items[item3]._id

                                if (items[item].items[item2].items[item3].items !== undefined) {
                                  for (let item4 in items[item].items[item2].items[item3].items) {
                                    for (let menu4 in Menu) {
                                      let tempitem4
                                      if (items[item].items[item2].items[item3].items[item4].screen_id == Menu[menu4].SCREEN_ID) {

                                        // tempitem4 = {
                                        //   title: Menu[menu4].SCREEN_NAME,
                                        //   route: items[item].items[item2].items[item3].items[item4].route,
                                        //   comment: Menu[menu3].items[item4].SCREEN_NAME,
                                        //   screen_id: items[item].items[item2].items[item3].items[item4].screen_id,
                                        //   icon: items[item].items[item2].items[item3].items[item4].icon,
                                        //   items: []
                                        // }

                                        tempitem4 = {}
                                        tempitem4['title'] = Menu[menu4].SCREEN_NAME
                                        if (items[item].items[item2].items[item3].items[item4].route !== undefined) tempitem3['route'] = items[item].items[item2].items[item3].items[item4].route
                                        tempitem4['comment'] = Menu[menu4].SCREEN_NAME
                                        if (items[item].items[item2].items[item3].items[item4].screen_id !== undefined) tempitem4['screen_id'] = items[item].items[item2].items[item3].items[item4].screen_id
                                        if (items[item].items[item2].items[item3].items[item4].icon !== undefined) tempitem4['icon'] = items[item].items[item2].items[item3].items[item4].icon
                                        if (items[item].items[item2].items[item3].items[item4].items !== undefined) tempitem4['items'] = []
                                        if (items[item].items[item2].items[item3].items[item4]._id !== undefined) tempitem4['_id'] = items[item].items[item2].items[item3].items[item4]._id
                                      
                                        tempitem3.items.push(tempitem4)
                                      }
                                    }
                                  }
                                }


                                tempitem2.items.push(tempitem3)

                                break

                              }
                            }
                          }
                        }

                        tempitem.items.push(tempitem2)

                        break

                      }
                    }
                  }
                }
                objectitem.push(tempitem)
                break;
              }
            }
          }
          dispatch(success(objectitem));
        },
        error => {
          console.log("Navigation Error")
        })
      function success(items) { return { type: NAVIGATION_INIT, items } }


    } catch (e) {
      console.log(e.message)
    }

  }
}

function addId(item) {
  if (item.items) {
    item.items = item.items.map(addId)
  }

  if (!item._id) {
    item._id = Math.random().toString(36).slice(2)
  }

  return item
}

