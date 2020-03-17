template.last_modified_files = `
<div class="tables_listing">
  <div class="table_wrap" style="width: auto; max-width: 100%; margin-left: auto; margin-right: auto;">
    <div class="variables_listing_wrap" style="width: auto; max-width: 100%;">
      <div id="search_bar_container">
        <input type="text" class="search_bar" value="{{search}}" placeholder="Search...">
      </div>
      <div id="table_last_file_modif_container"></div>
    </div>
  </div>
</div>
`;

template.last_modified_files_table = `
{{#is_file}}
<table class="table_last_file_modif">
  <tr>
    <th>path</th>
    <th>file</th>
    <th>type</th>
    <th>last modification</th>
  </tr>
  <!-- {{#last_modified_files}} -->
  <tr class="last_file_modif_row" data-path="{{path_from_current_directory}}">
    <td class="last_file_modif_td_path">{{path_from_current_directory}}</td>
    <td>{{file_name}}</td>
    <!-- {{#is_icon}} -->
    <td><img src="web/media/img/file_icon/{{extension}}.png" class="little_icon"></td>
    <!-- {{/is_icon}} -->
    <!-- {{^is_icon}} -->
    <td>{{extension_clean}}</td>
    <!-- {{/is_icon}} -->
    <td>{{last_modif_ago_clean}}</td>
  </tr>
  <!-- {{/last_modified_files}} -->
</table>
{{/is_file}}
{{^is_file}} 
<div style="text-align: center;">no file found</div>
{{/is_file}}
`;