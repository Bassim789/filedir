template.form_modal = `
<div id="dialog-form" title="Catalog" style="display: none;">
  <form id="form_add_new_catalog">
    <fieldset style="border: none;">
      <div class="wrap">

        <input type="hidden" name="old_catalog_name" id="old_catalog_name">

        <div>
          <label for="catalog_name">Name</label>
          <input type="text" name="catalog_name" id="catalog_name" class="cool" placeholder="...">
        </div>

        <div>
          <label for="path_to_scan">Path to scan</label>
          <input type="text" name="path_to_scan" id="path_to_scan" class="cool" placeholder="...">
        </div>

        <div>
          <label for="alias">Alias</label>
          <input type="text" name="alias" id="alias" class="cool" placeholder="...">
        </div>

        <div>
          <label for="use_alias_on_file">Use alias on file</label>
          <input type="text" name="use_alias_on_file" id="use_alias_on_file" class="cool" placeholder="...">
        </div>

        <div>
          <label for="exclude_folders">Exclude folders</label>
          <input type="text" name="exclude_folders" id="exclude_folders" class="cool" placeholder="...">
        </div>

      </div>
      <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
    </fieldset>
  </form>
</div>
`;