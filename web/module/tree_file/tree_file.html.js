template.tree_file = `

<div class="database_box">

  <div class="database_name">
    {{root_path}}/
    <br>
    {{#inner_path_parts}}<span class="inner_path_part" data-value="{{inner_path_part_value}}">{{inner_path_part}}/</span>{{/inner_path_parts}}
  </div>

  <div class="database_info" style="float: right;">
    {{#parent_directory}}
      dossiers: {{nb_folder_recursive_clean}}<br>
      fichiers: {{nb_file_recursive_clean}} <br>
      taille: {{size_recursive_clean}} <br>
    {{/parent_directory}}
    types: {{nb_file_types}} 
  </div>

  <div class="tables_listing">
    <div class="table_wrap" style="max-height: 300px; overflow: auto;">
      <div class="variables_listing_wrap">      
        <div class="variables_listing">
          {{#file_types}}
          <div class="variable_box click_filter_type" data-file_type="{{file_type}}">
            <table class="variable_table">
              <tbody class="variable_main_info_section">
                <tr>
                  <th colspan="2">

                    <!-- {{#is_icon}} -->
                    <img src="web/media/img/file_icon/{{file_type}}.png" class="file_icon">
                    <!-- {{/is_icon}} -->
                    <!-- {{^is_icon}} -->
                    <span data-file_type="{{file_type}}">
                      {{file_type}}
                    </span>
                    <!-- {{/is_icon}} -->

                    <br><br>
                    
                  </th>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <span style="text-align: center;">
                      <span>
                        {{file_type}}
                      </span>
                      <br>
                      {{nb_file_recursive_clean}} fichiers <br>
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
        <div class="variables_listing">
          {{#current_directories}}
          <div class="variable_box click_folder" data-directory="{{directory}}">
            <table class="variable_table">
              <tbody class="variable_main_info_section">
                <tr>
                  <th colspan="2">
                    <span class="variable_name" data-directory="{{directory}}">
                      {{directory}}
                    </span>
                  </th>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: center; padding: 10px;">
                    <img src="web/media/img/folder_icon.png" class="file_icon">
                  </td>
                </tr>
              </tbody>
              <tbody class="variable_rows_section">
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
          {{/current_directories}}

          {{#current_files}}
          <div class="variable_box">
            <table class="variable_table">
              <tbody class="variable_main_info_section">
                <tr>
                  <th colspan="2">
                    <span class="variable_name">{{file_name}}</span>
                  </th>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: center; padding: 10px;">
                    <!-- {{#is_icon}} -->
                    <img src="web/media/img/file_icon/{{file_type_short_name}}.png" class="file_icon">
                    <!-- {{/is_icon}} -->
                    <!-- {{^is_icon}} -->
                    <span class="file_type_short_name">{{file_type_short_name}}</span>
                    <!-- {{/is_icon}} -->
                  </td>
                </tr>
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
          {{/current_files}}
        </div>
      </div>
    </div>
  </div>
</div>
`;