template.filedir = `

<div class="tables_listing">
  <div class="table_wrap" style="width: 100%; background: none;">

     <div style="display: inline-block; max-width: 100%;">
      <div class="database_name">
        <div id="path_parts">
          <span>
            <img src="web/media/img/home_icon.png" class="home_icon">
          </span>
          <span class="alias">{{alias}}</span>{{#inner_path_parts}}<span class="inner_path_part" data-value="{{inner_path_part_value}}">{{inner_path_part}}/</span>{{/inner_path_parts}}
        </div>
        <div id="select_path_wrap"><select></select></div>
      </div>

      {{#parent_directory_description}}
      <div class="separation"></div>
      <div class="database_description_wrap">
      <div class="database_description">{{parent_directory_description}}
      </div>
      </div>
      {{/parent_directory_description}}

    </div>

    <div class="database_info" style="float: right;">
    {{#parent_directory}}
      {{nb_folder_clean}}
      <img src="web/media/img/folder_icon.png" class="little_icon"><br>
      {{nb_file_clean}}
      <img src="web/media/img/file_little_icon.png" class="little_icon"><br>
      {{size_clean}}
    {{/parent_directory}}
    </div>
  
  </div>
</div>


<div class="tables_listing">
  <div class="table_wrap" style="max-height: 170px; overflow: auto;">
    <div class="variables_listing_wrap">
      <span class="nb_file_type">type: {{nb_file_types}}</span>
      <div class="variables_listing file_type">
        {{#file_types}}
        <div class="variable_box click_filter_type {{file_type}}" 
              data-file_type="{{file_type}}">
          <div class="variable_order_num">#{{order_num}}</div>
          <div>
            <div data-file_type="{{file_type}}" class="name" style="padding-bottom: 5px;">
              {{file_type_clean}}
            </div>
            <!-- {{#is_icon}} -->
            <img src="web/media/img/file_icon/{{file_type}}.png" class="file_type_icon">
            <!-- {{/is_icon}} -->
          </div>
          <table class="variable_table">
            <tr>
              <td style="text-align: center;">
                <span style="text-align: center;">
                  {{nb_file_clean}}
                  <img src="web/media/img/file_little_icon.png" class="little_icon" style="height: 15px;"><br>
                  {{size_clean}}
                </span>
              </td>
            </tr>
          </table>
        </div>
        {{/file_types}}
      </div>
    </div>
  </div>
</div>


<div class="tables_listing">
  <div class="table_wrap">

    <div class="variables_listing_wrap">
      <span class="nb_file_type">{{nb_folder}} <img src="web/media/img/folder_icon.png" class="little_icon"></span>     
      <div class="variables_listing">
      {{#current_directories}}
        {{#first_hidden}}
        <div class="btn_show_hidden"><p>Show hidden</p></div>
        <div class="hidden_box" data-type="folder" style="display: none;">
        {{/first_hidden}}
        <div class="variable_box click_folder" data-directory="{{directory}}">
          <div class="variable_order_num">#{{order_num}}</div>
          <div>
            <div class="variable_name" data-directory="{{directory}}">
              {{directory}}
            </div>
            {{#description}}
            <div class="variable_description">
              {{description}}
            </div>
            {{/description}}
          </div>
          <table class="variable_table">
            <tbody class="variable_rows_section">
              <tr>
                <td valign="bottom" colspan="2" style="text-align: center; padding: 0px;">
                  <img src="web/media/img/folder_icon.png" class="file_icon">
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
            </tbody>
          </table>
        </div>
        {{#last_hidden}}
        </div>
        {{/last_hidden}}
        {{/current_directories}}
      </div>
    </div>
  </div>
</div>
  

<div class="tables_listing">
  <div class="table_wrap">
    <div class="variables_listing_wrap">
      <span class="nb_file_type">{{nb_file}} <img src="web/media/img/file_little_icon.png" class="little_icon"></span>     
      <div class="variables_listing">
        {{#current_files}}
        {{#first_hidden}}
        <div class="btn_show_hidden"><p>Show hidden</p></div>
        <div class="hidden_box" data-type="file" style="display: none;">
        {{/first_hidden}}
        <div class="variable_box click_file" data-file="{{file_name}}">
          <div class="variable_order_num">#{{order_num}}</div>
          <div>
            <div class="variable_name">{{file_name}}</div>
          </div>
          <table class="variable_table">
              <!-- {{#is_icon}} -->
              <tr>
                <td valign="bottom" colspan="2" style="text-align: center; padding: 5px;">
                  <img src="web/media/img/file_icon/{{extension}}.png" class="file_icon">
                </td>
              </tr>
              <!-- {{/is_icon}} -->
              <!-- {{^is_icon}} {{#extension}} -->
              <tr>
                <td colspan="2" style="text-align: center; padding: 5px;">
                  <span class="extension">{{extension_clean}}</span>
                </td>
              </tr>
               <!-- {{/extension}} {{/is_icon}} -->
              <!-- {{#rows_info}} -->
                <tr class="table_modalities">
                  <td class="modality_value_wrap">
                    <span class="modality_value">{{name}}</span>
                  </td>
                  <td valign="bottom">
                    <div class="modality_frequence_box">
                      <div class="modality_frequence">
                        <!-- {{#hide_percent}} --> 
                        <spon class="percent_value" style="visibility: hidden;">{{percent}}%</spon>
                        <!-- {{/hide_percent}} --> 
                        <!-- {{^hide_percent}} --> 
                        <spon class="percent_value">{{percent}}%</spon>
                        <!-- {{/hide_percent}} --> 
                        <span class="frequency">{{nb_clean}}</span> 
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
                <td valign="bottom" colspan="2" style="text-align: center;">
                  {{last_modif_clean}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {{#last_hidden}}
        </div>
        {{/last_hidden}}
        {{/current_files}}
      </div>
    </div>
  </div>
</div>
`;
