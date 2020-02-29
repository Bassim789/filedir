template.tree_file = `

<div class="database_box">

  <div class="database_name">
    {{root_path}}/
    <br>
    {{#inner_path_parts}}
    <span class="inner_path_part" data-value="{{inner_path_part_value}}">
      {{inner_path_part}}/
    </span>
    {{/inner_path_parts}}
  </div>

  <div class="database_info" style="float: right;">
    {{#parent_directory}}
      dossiers: {{nb_folder_recursive}}<br>
      fichiers: {{nb_file_recursive}}
    {{/parent_directory}}
  </div>
  
  <div class="tables_listing">
    <div class="table_wrap">

      <div class="variables_listing_wrap">      
        <div class="variables_listing">
          {{#current_directories}}
          <div class="variable_box">
            <table class="variable_table">
              <tbody class="variable_main_info_section">
                <tr>
                  <th colspan="2">
                    <span class="variable_name clickable">{{directory}}</span>
                  </th>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: center; padding: 10px;">
                    <span class="variable_type_number">Dossier</span>
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
                    <span class="variable_name clickable">{{file_name}}</span>
                  </th>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: center; padding: 10px;">
                    <span class="variable_type_text">Fichier</span>
                  </td>
                </tr>
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