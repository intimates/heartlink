class RemoveFromUidFromMessages < ActiveRecord::Migration
  def change
    remove_column :messages, :from_uid, :string
  end
end
