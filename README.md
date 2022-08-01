## Mobile view for Docs.plus
This plugin brings a completely custom "adoptive mobile view" to the [docs.plus](https://github.com/nwspk/docs.plus).

The plugin detects the client-side request and then provides a custom `pad.html` with a custom function if the request is from a mobile device.



# Prebuild Modal
In order to have your own custom modal plugin wrapper, we suggest you create and have this pre-made modal.

| Options  | Value | Description |
|---|---|---|
| Position  |  "left" or "bottom" | Medal position that will be pop up |
| "height" or "width"  |  "h50", "h25", "h75" or "h90", "w75", "w90" | Content wrapper size by position |
| CustomButtoms | Html content | Custom HTML content to be added, like toolbar buttons |
| HtmlContent | Html content | Custom HTML content to be added, content of plugin |

```html
  <div id="{modalId}" class="ndModal {position} {height|width}">
    <div class="wrapper">
      <div class="header">
        <div class="title">table of Contents</div>
        <div class="menu">
          {CustomButtoms}
        </div>
      </div>
      <div class="content">
        {HtmlContent}
      </div>
    </div>
  </div>
```

> Note: The `{ModalId}` must be unique and CSS styles must be included in the plugin.

> Note: We dynamically add the modal close button to `.header> .menu`,  Take a look at this [function](https://github.com/HMarzban/ep_mobile_view/blob/36f8ffa66a4de71f2d347499e37d09df979bb212/static/js/index.js#L6-L34)

### Preserved modaIDs

* tableOfContentsModal
* filterHeadersModal
* chatModal
* _*your modal Id_

Feel free and add your modal then start your journey

### Example:
```html
  <!--ep_table_of_contents-->
  <div id="tableOfContentsModal" class="ndModal left w90">
    <div class="wrapper">
      <div class="header">
        <div class="title">Table of Contents</div>
        <div class="menu"></div>
      </div>
      <div class="content"></div>
    </div>
  </div>

  <!--ep_headerview-->
  <div id="filterHeadersModal" class="ndModal bottom h75">
    <div class="wrapper">
      <div class="header">
        <div class="title">Filters</div>
        <div class="menu"></div>
      </div>
      <div class="content"></div>
    </div>
  </div>
```
