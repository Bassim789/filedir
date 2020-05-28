template.metacat = `
<div id="metacat_container">
  
  <div class="tables_listing">
    <div class="table_wrap" style="width: 100%; background: none;">

      <div class="database_name">
        <div id="select_path_wrap"><select></select></div>
      </div>

      <div class="database_info" style="float: right;">
        {{nb_folder_clean}}
        <img src="web/media/img/folder_icon.png" class="little_icon"><br>
        {{nb_file_clean}}
        <img src="web/media/img/file_little_icon.png" class="little_icon"><br>
        {{size_clean}}
      </div>
    </div>
  </div>


  <div class="tables_listing">
    <div class="table_wrap">

      <div class="btn_add_new_catalog_container">
        <button class="btn_add_new_catalog">Add new catalog</button>
      </div>

      <div class="variables_listing_wrap">
        <span class="nb_file_type">{{nb_catalog}} <img src="web/media/img/catalog_icon.png" class="little_icon"></span>     
        <div class="variables_listing">
        {{#catalogs}}
          <div class="variable_box">
            <div>
              <div class="variable_name click_catalog" data-catalog="{{catalog_name}}">
                {{catalog_name}}
              </div>
            </div>
            <table class="variable_table">
              <tbody class="variable_rows_section">
                <tr>
                  <td valign="bottom" colspan="2" style="text-align: center; padding: 0px;">
                    <img src="web/media/img/catalog_icon.png" class="file_icon">
                  </td>
                </tr>
                <!-- {{#rows_info}} -->
                  <tr class="table_modalities">
                    <td valign="bottom">
                      <div class="modality_frequence_box">
                        <div class="modality_frequence">
                          <!-- {{#hide_percent}} --> 
                          <spon class="percent_value" style="visibility: hidden;">{{percent}}%</spon>
                          <!-- {{/hide_percent}} --> 
                          <!-- {{^hide_percent}} --> 
                          <spon class="percent_value">{{percent}}%</spon>
                          <!-- {{/hide_percent}} --> 
                          <span class="frequency">
                            {{nb_clean}}
                            {{#img_folder}}
                              <img src="web/media/img/folder_icon.png" class="little_icon"><br>
                            {{/img_folder}}
                            {{#img_file}}
                              <img src="web/media/img/file_little_icon.png" class="little_icon"><br>
                            {{/img_file}}
                          </span> 
                        </div>
                        <div class="modality_frequence_hidden">
                          <spon class="percent_value">{{percent}}%</spon>
                          <span class="frequency">{{nb_clean}}</span> 
                        </div>
                        <div class="percent_bar {{percent_error_bar}}" style="width: {{percent}}%;"></div>
                      </div>
                    </td>
                  
                  </tr>
                <!-- {{/rows_info}} -->
                <tr>
                  <td style="text-align: center;">
                    <button class="btn_delete_catalog" data-catalog="{{catalog_name}}">delete</button>
                    <button class="btn_scan_catalog" data-catalog="{{catalog_name}}">scan</button>
                    <button class="btn_config_catalog" data-catalog="{{catalog_name}}">config</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {{/catalogs}}
        </div>
      </div>
    </div>
  </div>
</div>
`;