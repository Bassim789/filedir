template.filedir = `

<div class="database_box">

 <div style="display: inline-block;">
  <div class="database_name">
    {{root_path}}/
    <br>
    {{#inner_path_parts}}<span class="inner_path_part" data-value="{{inner_path_part_value}}">{{inner_path_part}}/</span>{{/inner_path_parts}}
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
      {{nb_folder_recursive_clean}}
      <img src="web/media/img/folder_icon.png" class="little_icon"><br>
      {{nb_file_recursive_clean}}
      <img src="web/media/img/file_little_icon.png" class="little_icon"><br>
      {{size_recursive_clean}}
    {{/parent_directory}}
  </div>

  <div class="tables_listing">
    <div class="table_wrap" style="max-height: 170px; overflow: auto;">
      <div class="variables_listing_wrap">
        <span class="nb_file_type">type: {{nb_file_types}}</span>
        <div class="variables_listing">
          {{#file_types}}
          <div class="variable_box click_filter_type {{file_type}}" 
                data-file_type="{{file_type}}">
            <div class="variable_order_num">#{{order_num}}</div>
            <table class="variable_table">
              <tbody class="variable_main_info_section">
                <tr>
                  <th colspan="2">
                    <!-- {{#is_icon}} -->
                    <img src="web/media/img/file_icon/{{file_type}}.png" class="file_type_icon">
                    <!-- {{/is_icon}} -->
                    <!-- {{^is_icon}} -->
                    <span data-file_type="{{file_type}}">
                      {{file_type}}
                    </span>
                    <div style="padding-bottom: 15px; width: 100%;"></div>

                    <!-- {{/is_icon}} -->
                  </th>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <span style="text-align: center;">
                      <!-- {{#is_icon}} -->
                      <span>
                        {{file_type}}
                      </span>
                      <!-- {{/is_icon}} -->
                      <br>
                      {{nb_file_recursive_clean}}
                      <img src="web/media/img/file_little_icon.png" class="little_icon" style="height: 15px;"><br>
                      {{size_recursive_clean}}
                    </span>
                  </td>
                </tr>
              </tbody>
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
        <span class="nb_file_type">dossier: {{nb_folder}}</span>     
        <div class="variables_listing">
        {{#current_directories}}
          {{#first_hidden}}
          <div class="btn_show_hidden">Voir les cachés</div>
          <div class="hidden_box" data-type="folder" style="display: none;">
          {{/first_hidden}}
          <div class="variable_box click_folder" data-directory="{{directory}}">
            <div class="variable_order_num">#{{order_num}}</div>
            <table class="variable_table">
              <tbody class="variable_main_info_section">
                <tr>
                  <th colspan="2">
                    <span class="variable_name" data-directory="{{directory}}">
                      {{directory}}
                    </span>
                  </th>
                </tr>
                {{#description}}
                <tr><td class="variable_description" colspan="2">
                  <div class="variable_description_content">{{description}}</div>
                </td></tr>
                {{/description}}
                <tr>
                  <td colspan="2" style="text-align: center; padding: 0px;">
                    <img src="web/media/img/folder_icon.png" class="file_icon">
                  </td>
                </tr>
              </tbody>
              <tbody class="variable_rows_section">
                <!-- {{#rows_info}} -->
                  <tr class="table_modalities">
                    <!--
                    <td class="modality_value_wrap">
                      <span class="modality_value">{{name}}</span>
                    </td>
                    -->
                    <td>
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
                        <div class="percent_bar {{percent_error_bar}}" style="width: min(100%, {{percent}}%);"></div>
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
        <span class="nb_file_type">fichier: {{nb_file}}</span>     
        <div class="variables_listing">
          {{#current_files}}
          {{#first_hidden}}
          <div class="btn_show_hidden">Voir les cachés</div>
          <div class="hidden_box" data-type="file" style="display: none;">
          {{/first_hidden}}
          <div class="variable_box">
            <div class="variable_order_num">#{{order_num}}</div>
            <table class="variable_table">
              <tbody class="variable_main_info_section">
                <tr>
                  <th colspan="2">
                    <span class="variable_name">{{file_name}}</span>
                  </th>
                </tr>
                <!-- {{#is_icon}} -->
                <tr>
                  <td colspan="2" style="text-align: center; padding: 10px;">
                    <img src="web/media/img/file_icon/{{file_type_short_name}}.png" class="file_icon">
                  </td>
                </tr>
                <!-- {{/is_icon}} -->
                <!-- {{^is_icon}} {{#file_type_short_name}} -->
                <tr>
                  <td colspan="2" style="text-align: center; padding: 10px;">
                    <span class="file_type_short_name">{{file_type_short_name}}</span>
                  </td>
                </tr>
                 <!-- {{/file_type_short_name}} {{/is_icon}} -->
                <!-- {{#rows_info}} -->
                  <tr class="table_modalities">
                    <td class="modality_value_wrap">
                      <span class="modality_value">{{name}}</span>
                    </td>
                    <td>
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
                        <div class="percent_bar {{percent_error_bar}}" style="width: min(100%, {{percent}}%);"></div>
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
          {{/current_files}}
        </div>
      </div>
    </div>
  </div>
</div>
`;