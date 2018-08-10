import React from 'react'

export default class UiDatepicker extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    const onSelectCallbacks = [];
    const props = this.props;
    const element = $(this.refs.input);
    const self = this;


    // if (props.minRestrict) {
    //   onSelectCallbacks.push((selectedDate) => {
    //     $(props.minRestrict).datepicker('option', 'minDate', selectedDate);
    //   });
    // }
    // if (props.maxRestrict) {
    //   onSelectCallbacks.push((selectedDate) => {
    //     $(props.maxRestrict).datepicker('option', 'maxDate', selectedDate);
    //   });
    // }


    // if (props.addday) {
    //   onSelectCallbacks.push((selectedDate, instance) => {
    //     if (selectedDate != '') { //added this to fix the issue       
    //       var date = $.datepicker.parseDate(instance.settings.dateFormat, selectedDate, instance.settings);
    //       date.setDate(date.getDate() + parseInt(props.addday));
    //       $(props.dateto).datepicker("option", "minDate", selectedDate);
    //       $(props.dateto).datepicker("option", "maxDate", date);
    //       self.props.onInputChange(selectedDate)
    //     }
    //   })

    //   onSelectCallbacks.push((selectedDate, instance) => {
    //     // $(props.datefrom).datepicker("option", "maxDate", selectedDate);
    //     self.props.onInputChange(selectedDate)
    //   })
    // }

    // //Let others know about changes to the data field
    // onSelectCallbacks.push((selectedDate) => {
    //   element.triggerHandler("change");

    //   const form = element.closest('form');

    //   if (typeof form.bootstrapValidator == 'function') {
    //     try {
    //       form.bootstrapValidator('revalidateField', element);
    //     } catch (e) {
    //       // console.log(e.message)
    //     }
    //   }
    // });

    // const options = {
    //   prevText: '<i class="fa fa-chevron-left"></i>',
    //   nextText: '<i class="fa fa-chevron-right"></i>',
    //   onSelect: (selectedDate, instance) => {

    //     onSelectCallbacks.forEach((cb) => {
    //       cb.call(cb, selectedDate, instance)
    //     })
    //   }
    // };



    // if (props.numberOfMonths) options.numberOfMonths = props.numberOfMonths;

    // if (props.dateFormat) options.dateFormat = props.dateFormat;

    // if (props.defaultDate) options.defaultDate = props.defaultDate;

    // if (props.changeMonth) options.changeMonth = props.changeMonth;

    // if (props.changeYear) options.changeYear = props.changeYear;


    // element.datepicker(options);
    element.datepicker({
         prevText: '<i class="fa fa-chevron-left"></i>',
      nextText: '<i class="fa fa-chevron-right"></i>',
      changeMonth: true,
      changeYear: true,
      showButtonPanel: true,
      dateFormat: 'dd/mm/yy',
      onClose: function (dateText, inst) {
        $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
      }
    });
   
    // .on('changeDate',function(ev)
    // {
    //   console.log(ev.viewMode)
    //     if(ev.viewMode=='months')
    //     {
    //         var endingDate = new Date(ev.date);
    //         var endingMonth = endingDate.getMonth();
    //         var endingYear = endingDate.getFullYear();
    //         var endingDay = getDaysInMonth(endingMonth, endingYear);
    //         endingDate = new Date(endingYear,endingMonth,endingDay);
    //         // ending_month.setValue(endingDate);
    //         element.datepicker('setValue',ending_month.setValue(endingDate))
    //         element.datepicker('hide');                     
    //     }
    // });
  }

  render() {
    const {
      adddate, minRestrict, maxRestrict, changesMonth,
      numberOfMonths, dateFormat, defaultDate, changeMonth, changeYear, addday, datefrom, dateto, onInputChange,
      ...props
    } = { ...this.props };


    return (

      <label className="input input-group date" >
        <input type="text" {...props} ref="input" className="form-control" autoComplete="off" />
        <span className="input-group-addon">
          <span className="icon-append fa fa-calendar"></span>
        </span>
      </label>

      // <label className="input input-group date" >
      //   <input type="text" {...props} ref="input" className="form-control"  />
      //   <span className="input-group-addon">
      //     <span className="icon-append fa fa-calendar"></span>
      //   </span>
      // </label>
    )
  }
}