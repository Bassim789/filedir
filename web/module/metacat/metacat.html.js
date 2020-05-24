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

  <div id="dialog-form" title="Create new catalog" style="display: none;">
    <form id="form_add_new_catalog">
      <fieldset style="border: none;">
        <div class="wrap">
          <div>
            <label for="catalog_name">Name</label>
            <input type="text" name="catalog_name" id="catalog_name" class="cool">
          </div>

          <div>
            <label for="path_to_scan">Path to scan</label>
            <input type="text" name="path_to_scan" id="path_to_scan" class="cool">
          </div>

          <div>
            <label for="alias">Alias</label>
            <input type="text" name="alias" id="alias" class="cool">
          </div>

          <div>
            <label for="use_alias_on_file">Use alias on file</label>
            <input type="text" name="use_alias_on_file" id="use_alias_on_file" class="cool">
          </div>

          <div>
            <label for="exclude_folders">Exclude folders</label>
            <input type="text" name="exclude_folders" id="exclude_folders" class="cool">
          </div>

        </div>
        <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
      </fieldset>
    </form>
  </div>
</div>
`;